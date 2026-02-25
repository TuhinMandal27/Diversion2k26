const db = require("../db");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name,email,phone,password_hash) VALUES (?,?,?,?)",
    [name, email, phone, hash],
    () => res.json({ success: true })
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (!result.length) return res.status(401).json({ success: false });

      const match = await bcrypt.compare(password, result[0].password_hash);
      res.json({ success: match });
    }
  );
};