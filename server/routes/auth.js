import express from 'express';
const router = express.Router();

const USERS = [
  {
    id: 'CONDUCTOR_01',
    universityId: 'EMP-DHSGSU-501',
    mobileNumber: '+91 98765 00001',
    role: 'CONDUCTOR',
    assignedBusId: 'BUS_01',
    name: 'Authorized Conductor - Bus 01',
  },
  {
    id: 'STUDENT_01',
    universityId: 'DHSGSU-2024-1001',
    mobileNumber: '+91 98765 00002',
    role: 'STUDENT',
    name: 'Student User',
  },
];

router.post('/login', (req, res) => {
  const { universityId, password, role } = req.body;

  if (!universityId) {
    return res.status(400).json({ error: 'University ID or Mobile Number is required.' });
  }

  const user = USERS.find((u) => u.universityId === universityId || u.mobileNumber === universityId) || {
    id: 'USER_' + Date.now(),
    universityId: universityId,
    role: role || 'STUDENT',
    assignedBusId: role === 'CONDUCTOR' ? 'BUS_01' : undefined,
    name: role === 'CONDUCTOR' ? 'Authorized Conductor' : 'Student',
  };

  const token = 'Bearer_' + Buffer.from(JSON.stringify({ id: user.id, role: user.role })).toString('base64');

  res.json({
    token,
    user: {
      id: user.id,
      universityId: user.universityId,
      role: user.role,
      assignedBusId: user.assignedBusId,
      name: user.name,
    },
  });
});

export default router;
