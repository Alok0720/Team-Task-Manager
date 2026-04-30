import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

const seedDB = async () => {
  try {
    const time = Date.now();
    const adminEmail = `admin_${time}@seed.com`;
    const memberEmail = `member_${time}@seed.com`;
    const password = 'password123';

    console.log('Seeding...');
    
    // Admin
    const adminRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Alice Admin', email: adminEmail, password, role: 'Admin'
    });
    const adminToken = adminRes.data.token;
    
    // Member
    const memberRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Bob Member', email: memberEmail, password, role: 'Member'
    });
    const memberId = memberRes.data._id;
    
    // Project
    const projectRes = await axios.post(`${BASE_URL}/projects`, 
      { name: 'Seed Project', description: 'Testing the member flow.' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const projectId = projectRes.data._id;

    // Task assigned to member
    await axios.post(`${BASE_URL}/tasks`, 
      {
        title: 'Review Documentation',
        description: 'Please review the new docs before Friday.',
        project: projectId,
        assignee: memberId,
        dueDate: '2026-12-31'
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    console.log(`SEED_SUCCESS: Member Email: ${memberEmail}, Password: ${password}`);
  } catch (err) {
    console.error('SEED_ERROR', err);
  }
};

seedDB();
