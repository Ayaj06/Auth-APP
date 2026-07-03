import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users as UsersIcon, 
  Clock, 
  UserPlus, 
  Download, 
  Calendar,
  Star
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9ff]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9ff] text-red-500 font-semibold">
        {error || 'Error loading dashboard'}
      </div>
    );
  }

  // Prepopulate standard metrics series using local postgres total revenue
  const chartData = [
    { name: 'Jan', revenue: 420000, lastYear: 380000 },
    { name: 'Mar', revenue: 510000, lastYear: 440000 },
    { name: 'May', revenue: 480000, lastYear: 460000 },
    { name: 'Jul', revenue: 620000, lastYear: 520000 },
    { name: 'Sep', revenue: 750000, lastYear: 610000 },
    { name: 'Nov', revenue: stats.total_revenue, lastYear: 680000 }
  ];

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Sidebar />
      <Header />
      
      {/* Main Canvas */}
      <main className="md:ml-64 p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">System Overview</h2>
            <p className="text-sm text-on-surface-variant">Real-time performance metrics and user acquisition data.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-surface-container-high px-4 py-2 rounded-lg border border-outline-variant flex items-center gap-2 cursor-pointer hover:bg-surface-container-highest transition-colors text-sm font-semibold">
              <Calendar className="h-4 w-4" />
              <span>Last 30 Days</span>
            </div>
            <button className="bg-primary text-white px-5 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Revenue */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary-fixed text-on-primary-fixed">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +{stats.revenue_growth_pct}%
              </span>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant mb-1">Total Revenue</p>
            <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">
              ${stats.total_revenue.toLocaleString()}
            </h3>
          </div>

          {/* Card 2: Active Users */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-surface-variant text-on-surface-variant">
                <UsersIcon className="h-5 w-5" />
              </div>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +{stats.active_users_growth_pct}%
              </span>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant mb-1">Active Users</p>
            <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">
              {(stats.active_users / 1000).toFixed(1)}k
            </h3>
          </div>

          {/* Card 3: Avg Session */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-red-500 text-xs font-bold flex items-center gap-0.5">
                <TrendingDown className="h-3 w-3" />
                {stats.avg_session_growth_pct}%
              </span>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant mb-1">Avg. Session Duration</p>
            <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">
              {stats.avg_session_duration}
            </h3>
          </div>

          {/* Card 4: New Signups */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +{stats.new_signups_growth_pct}%
              </span>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant mb-1">New Signups</p>
            <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">
              {stats.new_signups.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Charts & Bento Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Growth Line Chart (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-bold text-on-surface">Revenue Growth</h4>
                <p className="text-xs text-on-surface-variant">Performance comparison over the fiscal year.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="w-3 h-3 rounded-full bg-[#3525cd]"></span>
                  <span>This Year</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                  <span>Last Year</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3525cd" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3525cd" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#777587" fontSize={11} tickLine={false} />
                  <YAxis stroke="#777587" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#3525cd" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" />
                  <Area type="monotone" dataKey="lastYear" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Metric / Cards (Bento) */}
          <div className="flex flex-col gap-6">
            {/* Top Performer Card */}
            {stats.top_project && (
              <div className="bg-inverse-surface p-6 rounded-xl shadow-md text-surface-container-lowest flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container/20 flex items-center justify-center">
                      <Star className="h-5 w-5 text-indigo-300 fill-indigo-300" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Top Project</h4>
                  </div>
                  <p className="text-sm font-semibold opacity-95 mb-6">{stats.top_project.title}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Completion</span>
                    <span>{stats.top_project.completion_percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-container rounded-full" 
                      style={{ width: `${stats.top_project.completion_percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex -space-x-2 pt-2">
                    <img className="w-8 h-8 rounded-full border-2 border-inverse-surface object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-inverse-surface object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                    <div className="w-8 h-8 rounded-full bg-tertiary-container border-2 border-inverse-surface flex items-center justify-center text-[10px] font-bold">+{stats.top_project_team_count}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Region Usage */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex-1">
              <h4 className="text-sm font-bold text-on-surface mb-6">Usage by Region</h4>
              <div className="space-y-4">
                {stats.region_usage.map((region) => (
                  <div key={region.region} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-xs font-bold">{region.region}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{region.name}</span>
                        <span className="font-bold">{region.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${region.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <div>
              <h4 className="text-lg font-bold text-on-surface">Recent Activity</h4>
              <p className="text-xs text-on-surface-variant">Live feed of transactions and system events.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            {/* Desktop Table view */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant">
                  <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">User</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {stats.recent_activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-surface-container/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {activity.user?.avatar_url ? (
                          <img className="w-8 h-8 rounded-full object-cover" src={activity.user.avatar_url} alt="avatar" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                            {activity.user?.full_name ? activity.user.full_name[0] : 'U'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{activity.user?.full_name || 'System'}</p>
                          <p className="text-xs text-on-surface-variant">{activity.user?.email || 'system@saaspro.io'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{activity.event_type}</p>
                      <p className="text-xs text-on-surface-variant">{activity.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-tighter ${
                        activity.amount && activity.amount < 0
                          ? 'bg-red-50 text-red-700' 
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          activity.amount && activity.amount < 0 ? 'bg-red-500' : 'bg-emerald-500'
                        }`}></span>
                        {activity.amount && activity.amount < 0 ? 'Pending' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {new Date(activity.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-bold ${
                      activity.amount && activity.amount < 0 ? 'text-red-500' : 'text-on-surface'
                    }`}>
                      {activity.amount ? `${activity.amount < 0 ? '-' : ''}$${Math.abs(activity.amount).toFixed(2)}` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card view */}
            <div className="md:hidden divide-y divide-outline-variant">
              {stats.recent_activities.map((activity) => (
                <div key={activity.id} className="p-4 space-y-3 hover:bg-surface-container/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {activity.user?.avatar_url ? (
                        <img className="w-7 h-7 rounded-full object-cover" src={activity.user.avatar_url} alt="avatar" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                          {activity.user?.full_name ? activity.user.full_name[0] : 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-on-surface">{activity.user?.full_name || 'System'}</p>
                        <p className="text-[10px] text-on-surface-variant">{activity.user?.email || 'system@saaspro.io'}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      activity.amount && activity.amount < 0
                        ? 'bg-red-50 text-red-700' 
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {activity.amount && activity.amount < 0 ? 'Pending' : 'Completed'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">{activity.event_type}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{activity.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-[11px] text-on-surface-variant font-medium">
                    <span>{new Date(activity.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    <span className={`font-bold ${activity.amount && activity.amount < 0 ? 'text-red-500' : 'text-on-surface'}`}>
                      {activity.amount ? `${activity.amount < 0 ? '-' : ''}$${Math.abs(activity.amount).toFixed(2)}` : '--'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
