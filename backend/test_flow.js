import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

const runTest = async () => {
  try {
    console.log('--- STARTING E2E TEST FLOW ---');

    // 1. Register Admin
    console.log('1. Registering Admin user...');
    const adminRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Admin User',
      email: `admin_${Date.now()}@test.com`,
      password: 'password123',
      role: 'Admin',
    });
    const adminToken = adminRes.data.token;
    console.log('   ✅ Admin registered successfully.');

    // 2. Register Member
    console.log('2. Registering Member user...');
    const memberRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Member User',
      email: `member_${Date.now()}@test.com`,
      password: 'password123',
      role: 'Member',
    });
    const memberToken = memberRes.data.token;
    const memberId = memberRes.data._id;
    console.log('   ✅ Member registered successfully.');

    // 3. Admin creates a Project
    console.log('3. Admin is creating a Project...');
    const projectRes = await axios.post(
      `${BASE_URL}/projects`,
      { name: 'Secret Project', description: 'Very secret.' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const projectId = projectRes.data._id;
    console.log(`   ✅ Project created with ID: ${projectId}`);

    // 4. Admin creates a Task assigned to the Member
    console.log('4. Admin is creating a Task assigned to the Member...');
    const taskRes = await axios.post(
      `${BASE_URL}/tasks`,
      {
        title: 'Build the backend',
        description: 'Need to write Node.js code.',
        project: projectId,
        assignee: memberId,
        dueDate: '2026-12-31',
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const taskId = taskRes.data._id;
    console.log(`   ✅ Task created with ID: ${taskId} and assigned to Member ID: ${memberId}`);

    // 5. Member logs in and fetches tasks
    console.log('5. Member fetches their assigned tasks...');
    const memberTasksRes = await axios.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    console.log(`   ✅ Member fetched ${memberTasksRes.data.length} task(s).`);
    console.log(`   Task Title: "${memberTasksRes.data[0].title}", Status: ${memberTasksRes.data[0].status}`);

    // 6. Member updates task status to 'Completed'
    console.log('6. Member is completing the task...');
    const updateRes = await axios.put(
      `${BASE_URL}/tasks/${taskId}/status`,
      { status: 'Completed' },
      { headers: { Authorization: `Bearer ${memberToken}` } }
    );
    console.log(`   ✅ Task status updated to: ${updateRes.data.status}`);

    console.log('--- TEST FLOW COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('❌ TEST FAILED:', error.response ? error.response.data : error.message);
  }
};

runTest();
