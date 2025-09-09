import AdminRootLayout from '@/components/layouts/AdminRootLayout';
import { cookies } from 'next/headers';

const AdminLayout = ({ children }) => {
  return <AdminRootLayout>{children}</AdminRootLayout>;
};

export default AdminLayout;
