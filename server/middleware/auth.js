const { verifyToken } = require('../config/jwt')
const db = require('../config/db')

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未登录或token已过期' })
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    const [users] = await db.query('SELECT user_id, username, role_type, phone FROM users WHERE user_id = ?', [decoded.user_id])
    if (users.length === 0) {
      return res.status(401).json({ code: 401, message: '用户不存在' })
    }
    req.user = users[0]
    next()
  } catch (err) {
    return res.status(401).json({ code: 401, message: 'token无效或已过期' })
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role_type !== 'admin') {
    return res.status(403).json({ code: 403, message: '无权限访问，需要管理员权限' })
  }
  next()
}

// 管家权限中间件（管家或管理员均可访问）
function managerMiddleware(req, res, next) {
  if (!['manager', 'admin'].includes(req.user.role_type)) {
    return res.status(403).json({ code: 403, message: '无权限访问，需要管家或管理员权限' })
  }
  next()
}

// 仅管家可访问（管理员不可）
function managerOnlyMiddleware(req, res, next) {
  if (req.user.role_type !== 'manager') {
    return res.status(403).json({ code: 403, message: '无权限访问，需要管家权限' })
  }
  next()
}

module.exports = { authMiddleware, adminMiddleware, managerMiddleware, managerOnlyMiddleware }
