import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useAuthStore } from '../store/authStore';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  X,
  Shield,
  Briefcase,
  Eye,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';

export const UserManagement = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Table state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingUserId, setEditingUserId] = useState(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('Member');
  const [formStatus, setFormStatus] = useState('Active');
  const [formPassword, setFormPassword] = useState('');
  const [formError, setFormError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
      };
      if (search) params.q = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await axios.get('http://localhost:8000/api/users', { params });
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingUserId(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Member');
    setFormStatus('Active');
    setFormPassword('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUserId(user.id);
    setFormName(user.full_name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setFormPassword('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      if (modalMode === 'add') {
        if (!formPassword) {
          setFormError('Password is required for new users');
          return;
        }
        await axios.post('http://localhost:8000/api/users', {
          email: formEmail,
          full_name: formName,
          password: formPassword,
          role: formRole,
          status: formStatus
        });
      } else {
        await axios.put(`http://localhost:8000/api/users/${editingUserId}`, {
          email: formEmail,
          full_name: formName,
          role: formRole,
          status: formStatus,
          password: formPassword || undefined
        });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'An error occurred. Please try again.';
      setFormError(errMsg);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/users/${userId}`, {
        status: newStatus
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is permanent.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Super Admin':
      case 'Admin':
        return <Shield className="h-4.5 w-4.5 text-primary shrink-0" />;
      case 'Editor':
        return <Briefcase className="h-4.5 w-4.5 text-secondary shrink-0" />;
      case 'Security Officer':
        return <Shield className="h-4.5 w-4.5 text-indigo-500 shrink-0" />;
      default:
        return <UserIcon className="h-4.5 w-4.5 text-on-surface-variant shrink-0" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700';
      case 'Inactive':
        return 'bg-amber-100 text-amber-700';
      case 'Suspended':
        return 'bg-slate-100 text-slate-500';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Sidebar />
      <Header />

      <main className="md:ml-64 p-6 md:p-8 min-h-[calc(100vh-64px)] max-w-[1400px] mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-on-surface mb-1">User Management</h1>
            <p className="text-sm text-on-surface-variant">Manage organization members, roles, and security permissions.</p>
          </div>
          <div>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <UserPlus className="h-4.5 w-4.5" />
              Add New User
            </button>
          </div>
        </div>

        {/* Table Stats Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">Total Users</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-on-surface">{totalUsers}</p>
              <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs font-bold">+12%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">Active Now</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-on-surface">
                {users.filter(u => u.status === 'Active').length}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-on-surface-variant text-[11px] font-semibold">Real-time</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">Suspended Accounts</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-on-surface">
                {users.filter(u => u.status === 'Suspended').length}
              </p>
              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-bold">Critical</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">Average Session</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-on-surface">42m</p>
              <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">-2%</span>
            </div>
          </div>
        </div>

        {/* Table Toolbar controls */}
        <div className="bg-white rounded-t-xl border-x border-t border-outline-variant p-4 flex flex-wrap items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 min-w-[280px]">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-5 w-5" />
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary transition-all text-sm"
                placeholder="Filter by name or email..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface transition-colors text-sm font-semibold"
            >
              <Filter className="h-4.5 w-4.5" />
              <span>Filter</span>
            </button>
          </form>

          <div className="flex items-center gap-2">
            <select 
              value={roleFilter} 
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-surface rounded-lg border border-outline-variant text-sm font-semibold text-on-surface outline-none focus:border-primary"
            >
              <option value="">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Security Officer">Security Officer</option>
              <option value="Viewer">Viewer</option>
              <option value="Member">Member</option>
            </select>

            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-surface rounded-lg border border-outline-variant text-sm font-semibold text-on-surface outline-none focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* User Table Grid */}
        <div className="bg-white rounded-b-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-outline-variant">
                    <th className="px-6 py-3.5"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></th>
                    <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">User Profile</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {users.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.avatar_url ? (
                            <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" src={item.avatar_url} alt="avatar" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
                              {item.full_name[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{item.full_name}</p>
                            <p className="text-xs text-on-surface-variant">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-on-surface font-medium">
                          {getRoleIcon(item.role)}
                          <span>{item.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        {item.last_login 
                          ? new Date(item.last_login).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-all" 
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          {item.id !== currentUser?.id && (
                            <>
                              <button 
                                onClick={() => handleStatusChange(item.id, item.status === 'Suspended' ? 'Active' : 'Suspended')}
                                className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-all" 
                                title={item.status === 'Suspended' ? 'Activate' : 'Suspend'}
                              >
                                <Ban className="h-4 w-4 text-amber-600" />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(item.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-on-surface-variant transition-all" 
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Pagination footer */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-white">
            <p className="text-xs text-on-surface-variant font-semibold">
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalUsers)} of {totalUsers} users
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-white font-semibold text-xs flex items-center justify-center">
                {page}
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * pageSize >= totalUsers}
                className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add / Edit User Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-outline-variant p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-outline hover:bg-slate-100 hover:text-on-surface transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-on-surface mb-1">
              {modalMode === 'add' ? 'Add New User' : 'Edit User Details'}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6">
              {modalMode === 'add' ? 'Configure details to provision a new user.' : 'Modify account privileges and active state.'}
            </p>

            {formError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-error-container p-3 text-xs text-on-error-container border border-error/10">
                <AlertCircle className="h-4 w-4 text-error shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary transition-all text-sm text-on-surface"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary transition-all text-sm text-on-surface"
                  placeholder="e.g. john.doe@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary transition-all text-sm text-on-surface"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Security Officer">Security Officer</option>
                    <option value="Viewer">Viewer</option>
                    <option value="Member">Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary transition-all text-sm text-on-surface"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Password {modalMode === 'edit' && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  required={modalMode === 'add'}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary transition-all text-sm text-on-surface"
                  placeholder={modalMode === 'add' ? '••••••••' : '••••••••'}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-outline-variant mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] shadow-md"
                >
                  {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
