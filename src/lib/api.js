const API_BASE = '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Users ───
export async function getUsers() {
  return request('/users');
}

// ─── Attendance ───
export async function getAttendance(userId) {
  const qs = userId ? `?userId=${userId}` : '';
  return request(`/attendance${qs}`);
}

export async function checkIn(userId) {
  return request('/attendance', {
    method: 'POST',
    body: JSON.stringify({ userId, action: 'checkIn' }),
  });
}

export async function checkOut(userId) {
  return request('/attendance', {
    method: 'POST',
    body: JSON.stringify({ userId, action: 'checkOut' }),
  });
}

// ─── Leaves ───
export async function getLeaves(userId) {
  const qs = userId ? `?userId=${userId}` : '';
  return request(`/leaves${qs}`);
}

export async function createLeave(data) {
  return request('/leaves', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLeave(id, status, adminComments) {
  return request('/leaves', {
    method: 'PATCH',
    body: JSON.stringify({ id, status, adminComments }),
  });
}

// ─── Payroll ───
export async function getPayroll(userId) {
  const qs = userId ? `?userId=${userId}` : '';
  return request(`/payroll${qs}`);
}
