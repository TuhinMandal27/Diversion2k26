from flask import Flask, request, jsonify
import cv2
import mediapipe as mp
import numpy as np
import base64
import time
from scipy.spatial import distance

app = Flask(__name__)

# =========================
# MediaPipe Models
# =========================
mp_pose = mp.solutions.pose
mp_face = mp.solutions.face_mesh

pose = mp_pose.Pose()
face_mesh = mp_face.FaceMesh(refine_landmarks=True)

# =========================
# State Tracking
# =========================
last_movement_time = time.time()
last_upright_time = time.time()
last_eye_open_time = time.time()

# =========================
# Thresholds
# =========================
MOVEMENT_VARIANCE_THRESH = 0.0005
UNRESPONSIVE_TIME = 5          # seconds
FALL_TIME_THRESHOLD = 4        # seconds lying down
EYE_CLOSED_THRESHOLD = 3       # seconds
EYE_AR_THRESH = 0.20

# MediaPipe eye landmark indices
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]


def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)


@app.route("/analyze", methods=["POST"])
def analyze_frame():
    global last_movement_time, last_upright_time, last_eye_open_time

    data = request.json
    frame_b64 = data["frame"]

    # Decode base64 image
    img_bytes = base64.b64decode(frame_b64.split(",")[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    pose_result = pose.process(rgb)
    face_result = face_mesh.process(rgb)

    status = []
    alerts = []

    # =========================
    # MOVEMENT + UNRESPONSIVE
    # =========================
    if pose_result.pose_landmarks:
        landmarks = pose_result.pose_landmarks.landmark
        y_positions = [lm.y for lm in landmarks]
        variance = np.var(y_positions)

        if variance > MOVEMENT_VARIANCE_THRESH:
            last_movement_time = time.time()
            status.append("Movement detected")
        else:
            if time.time() - last_movement_time > UNRESPONSIVE_TIME:
                alerts.append(" Patient possibly unresponsive")
                status.append("No movement detected")
            else:
                status.append("Patient still")

    else:
        status.append("No person detected")

    # =========================
    # FALL DETECTION
    # =========================
    if pose_result.pose_landmarks:
        lm = pose_result.pose_landmarks.landmark

        left_shoulder = lm[mp_pose.PoseLandmark.LEFT_SHOULDER].y
        right_shoulder = lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].y
        left_hip = lm[mp_pose.PoseLandmark.LEFT_HIP].y
        right_hip = lm[mp_pose.PoseLandmark.RIGHT_HIP].y

        torso_height = abs(
            (left_shoulder + right_shoulder) / 2 -
            (left_hip + right_hip) / 2
        )

        if torso_height < 0.15:  # horizontal posture
            if time.time() - last_upright_time > FALL_TIME_THRESHOLD:
                alerts.append(" Fall detected — patient lying down")
            status.append("Body horizontal")
        else:
            last_upright_time = time.time()
            status.append("Upright posture")

    # =========================
    # EYE CLOSED DETECTION
    # =========================
    if face_result.multi_face_landmarks:
        face = face_result.multi_face_landmarks[0].landmark

        left_eye = [(face[i].x, face[i].y) for i in LEFT_EYE]
        right_eye = [(face[i].x, face[i].y) for i in RIGHT_EYE]

        ear = (eye_aspect_ratio(left_eye) +
               eye_aspect_ratio(right_eye)) / 2

        if ear < EYE_AR_THRESH:
            if time.time() - last_eye_open_time > EYE_CLOSED_THRESHOLD:
                alerts.append("⚠️ Eyes closed for prolonged duration")
            status.append("Eyes closed")
        else:
            last_eye_open_time = time.time()
            status.append("Eyes open")

    else:
        status.append("Face not detected")

    # =========================
    # RESPONSE
    # =========================
    return jsonify({
        "movement": time.time() - last_movement_time < UNRESPONSIVE_TIME,
        "status": status,
        "alerts": alerts,
        "critical": len(alerts) > 0
    })


if __name__ == "__main__":
    app.run(port=5001)