export default function adminCheck(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(401)
        .json({ error: "You are not authorized to access this route" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "You are not authenticated" });
  }
}
