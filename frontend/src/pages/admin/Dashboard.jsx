import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  Users, ShoppingCart, Package, DollarSign, 
  TrendingUp, Activity, ArrowUpRight, ArrowDownRight,
  ClipboardList, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Link } from 'react-router-dom';
import { BRAND } from '../../constants/brand';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, lowStockRes] = await Promise.all([
          API.get('/orders/stats/summary'),
          API.get('/medicines/admin/low-stock')
        ]);
        setStats(statsRes.data);
        setLowStock(lowStockRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading dashboard stats...</div>;

  const data = stats?.monthlyRevenue?.map(item => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][item._id - 1],
    revenue: item.revenue,
    orders: item.orders
  })) || [];

  const cards = [
    { title: 'Total Revenue', value: `Rs. ${stats?.totalRevenue || 0}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-primary-600', trend: '+12.5%', trendUp: true },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingCart className="w-6 h-6" />, color: 'bg-secondary-600', trend: '+8.2%', trendUp: true },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <Clock className="w-6 h-6" />, color: 'bg-amber-500', trend: '-2.4%', trendUp: false },
    { title: 'Delivered', value: stats?.deliveredOrders || 0, icon: <CheckCircle className="w-6 h-6" />, color: 'bg-green-600', trend: '+18.1%', trendUp: true },
  ];

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{BRAND.name} Admin</h1>
          <p className="text-slate-500">Welcome back! Here&apos;s what&apos;s happening at {BRAND.fullName} today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors">Download Report</button>
          <Link to="/admin/medicine/add" className="btn-primary">Add New Medicine</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 flex flex-col gap-4 overflow-hidden relative"
          >
            <div className={`w-12 h-12 rounded-2xl ${card.color} text-white flex items-center justify-center mb-2`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{card.value}</h3>
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${card.trendUp ? 'text-green-600' : 'text-red-500'}`}>
              {card.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {card.trend}
              <span className="text-gray-400 font-normal ml-1">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary-600" /> Revenue Performance
              </h3>
              <select className="bg-gray-50 border-none rounded-lg text-sm font-bold px-3 py-1 outline-none">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-600" /> Monthly Orders
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="orders" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-secondary-600" /> Order Status
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Completed', value: stats?.deliveredOrders || 0, color: 'bg-green-500', icon: <CheckCircle className="w-4 h-4" /> },
              { label: 'Pending', value: stats?.pendingOrders || 0, color: 'bg-amber-500', icon: <Clock className="w-4 h-4" /> },
              { label: 'Processing', value: stats?.totalOrders - stats?.deliveredOrders - stats?.pendingOrders || 0, color: 'bg-blue-500', icon: <Activity className="w-4 h-4" /> },
              { label: 'Cancelled', value: stats?.cancelledOrders || 0, color: 'bg-red-500', icon: <AlertCircle className="w-4 h-4" /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-bold text-gray-700">{item.label}</span>
                    <span className="text-sm font-black">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color}`} 
                      style={{ width: `${(item.value / Math.max(stats?.totalOrders || 1, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-red-50 rounded-3xl relative overflow-hidden border border-red-100">
            <div className="relative z-10">
              <h4 className="font-bold mb-2 text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Inventory Alerts
              </h4>
              <p className="text-sm text-red-600 mb-4 font-medium">
                {lowStock.length > 0 
                  ? `${lowStock.length} products are running low on stock. Restock soon to avoid lost sales.`
                  : 'All products have sufficient stock levels.'}
              </p>
              
              {lowStock.length > 0 && (
                <div className="space-y-3 mb-4">
                  {lowStock.slice(0, 3).map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-white p-2 rounded-lg text-sm">
                      <span className="font-semibold truncate w-3/4">{item.name}</span>
                      <span className="text-red-600 font-black">{item.stock} left</span>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/admin/medicines" className="bg-red-600 hover:bg-red-700 text-white transition px-4 py-2 rounded-xl text-xs font-black inline-block">
                Manage Inventory
              </Link>
            </div>
            <Package className="absolute -bottom-4 -right-4 w-20 h-20 text-red-200 transform rotate-12 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
