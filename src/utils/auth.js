// Utility to extract role from user_id prefix
export const getRoleFromUserId = (userId) => {
  const prefix = userId.substring(0, 3).toUpperCase();
  
  switch (prefix) {
    case 'ADM':
      return 'Admin';
    case 'TCH':
      return 'Teacher';
    case 'STU':
      return 'Student';
    case 'PAR':
      return 'Parent';
    default:
      return null;
  }
};

// Simulated JWT creation for frontend testing (Phase 1 Custom Auth)
export const generateMockJWT = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    ...user,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
};

export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
