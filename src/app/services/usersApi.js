const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jellyfish-app-z83s2.ondigitalocean.app/api';

export const UserAPI = {
  /*
  //get all admin users
  async getAdminUsers() {
    console.log(' Fetching all admin users');
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      console.log(' Response status:', response.status);
      
      if (!response.ok) {
        console.warn(' Could not fetch admin users, returning empty array');
        return [];
      }
      
      const data = await response.json();
      console.log(' Fetched admin users:', data);
      return data;
      
    } catch (error) {
      console.error(' Error fetching admin users:', error);
      return [];
    }
  },
  */

  async createAdminUser(userData) {
    console.log(' Creating admin user with data:', userData);
    
    try {
      if (!userData.aid) {
        throw new Error('AID is required to create an admin user');
      }

      const url = `${API_BASE_URL}/admin/addNewAdmin/${aid}`;
      console.log(' POST Request to:', url);
      
      const payload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        employeeNumber: userData.employeeNumber,
        department: userData.department,
        role: userData.role,
        aid: userData.aid
      };
      
      console.log(' Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(' Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' Error response:', errorText);
        throw new Error(`Failed to create admin user: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(' Admin user created successfully:', result);
      return result;
      
    } catch (error) {
      console.error(' Error creating admin user:', error);
      throw error;
    }
  },

  async updateAdminUser(userId, userData) {
    console.log(' Updating admin user:', userId);
    
    try {
      const url = `${API_BASE_URL}/admin/update/${userId}`;
      console.log(' PUT Request to:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          employeeNumber: userData.employeeNumber,
          department: userData.department,
          role: userData.role,
          aid: userData.aid
        })
      });

      console.log(' Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' Error response:', errorText);
        throw new Error(`Failed to update admin user: ${response.status}`);
      }

      const result = await response.json();
      console.log(' Admin user updated successfully:', result);
      return result;
      
    } catch (error) {
      console.error(' Error updating admin user:', error);
      throw error;
    }
  },

  async deleteAdminUser(userId) {
    console.log(' Deleting admin user:', userId);
    
    try {
      const url = `${API_BASE_URL}/admin/delete/${userId}`;
      console.log(' DELETE Request to:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(' Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' Error response:', errorText);
        throw new Error(`Failed to delete admin user: ${response.status}`);
      }

      const result = await response.json();
      console.log(' Admin user deleted successfully:', result);
      return result;
      
    } catch (error) {
      console.error(' Error deleting admin user:', error);
      throw error;
    }
  },

  async toggleUserStatus(userId, status) {
    console.log(' Toggling user status:', userId, status);
    
    try {
      const url = `${API_BASE_URL}/admin/status/${userId}`;
      console.log(' PATCH Request to:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      console.log(' Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' Error response:', errorText);
        throw new Error(`Failed to toggle user status: ${response.status}`);
      }

      const result = await response.json();
      console.log(' User status updated successfully:', result);
      return result;
      
    } catch (error) {
      console.error(' Error toggling user status:', error);
      throw error;
    }
  },

  async updateUserPermissions(userId, permissions) {
    console.log(' Updating user permissions:', userId);
    
    try {
      const url = `${API_BASE_URL}/admin/permissions/${userId}`;
      console.log(' PATCH Request to:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions })
      });

      console.log(' Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' Error response:', errorText);
        throw new Error(`Failed to update permissions: ${response.status}`);
      }

      const result = await response.json();
      console.log(' Permissions updated successfully:', result);
      return result;
      
    } catch (error) {
      console.error(' Error updating permissions:', error);
      throw error;
    }
  },
  
  async getRecruiterUsers() {
    console.log(' Fetching recruiter users');
    try {
      const response = await fetch(`${API_BASE_URL}/recruiter/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.warn(' Could not fetch recruiter users');
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error(' Error fetching recruiter users:', error);
      return [];
    }
  },

  async createRecruiterUser(userData) {
    console.log(' Creating recruiter user');
    try {
      let aid = localStorage.getItem('adminId');
      
      if (!aid) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          aid = user.id || user.aid || user.adminId;
        }
      }
      
      if (!aid) {
        throw new Error('Admin ID not found. Please log in again.');
      }

      const url = `${API_BASE_URL}/admin/addHRMember/${aid}`;
      console.log(' Full URL:', url);
      

      const payload = {
        admin_id: aid,
        hr_email: userData.email,
        hr_employee_number: userData.employeeNumber || userData.phoneNumber,
        first_name: userData.firstName,
        last_name: userData.lastName
      };
      
      console.log(' Sending payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(' Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' Backend error message:', errorText);
        throw new Error(`Failed to create recruiter user: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(' Recruiter user created successfully:', result);
      return result;
    } catch (error) {
      console.error(' Error creating recruiter user:', error);
      throw error;
    }
  },

  async getEmployeeUsers() {
    console.log(' Fetching employee users');
    try {
      const response = await fetch(`${API_BASE_URL}/employee/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.warn(' Could not fetch employee users');
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error(' Error fetching employee users:', error);
      return [];
    }
  },
  

  async createEmployeeUser(userData) {
    console.log(' Creating employee user');
    try {
      const response = await fetch(`${API_BASE_URL}/employee/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to create employee user');
      }

      return await response.json();
    } catch (error) {
      console.error(' Error creating employee user:', error);
      throw error;
    }
  },

  async getApplicantUsers() {
    console.log(' Fetching applicant users');
    try {
      const response = await fetch(`${API_BASE_URL}/applicant/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.warn(' Could not fetch applicant users');
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error(' Error fetching applicant users:', error);
      return [];
    }
  }
};
