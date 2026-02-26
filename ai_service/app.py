from flask import Flask, request, jsonify
import cv2
import mediapipe as mp
import numpy as np
import base64
import time

app = Flask(__name__)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

last_movement_time = time.time()

@app.route("/analyze", methods=["POST"])
def analyze_frame():
    global last_movement_time

    data = request.json
    frame_b64 = data["frame"]

    # Decode base64 frame
    img_bytes = base64.b64decode(frame_b64.split(",")[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = pose.process(rgb)

    movement_detected = False
    status = "No person detected"

    if result.pose_landmarks:
        landmarks = result.pose_landmarks.landmark

        # Check movement using landmark variance
        y_positions = [lm.y for lm in landmarks]
        variance = np.var(y_positions)

        if variance > 0.0005:
            movement_detected = True
            last_movement_time = time.time()
            status = "Movement detected"
        else:
            if time.time() - last_movement_time > 5:
                status = "Patient possibly unresponsive"
            else:
                status = "Patient still"

    return jsonify({
        "movement": movement_detected,
        "status": status
    })

if __name__ == "__main__":
    app.run(port=5001)