const bcrypt = require("bcrypt");
const db = require("../db");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false });
  }

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hash],
    (err) => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, rows) => {
      if (err || rows.length === 0) {
        return res.json({ success: false });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) return res.json({ success: false });

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }
  );
};