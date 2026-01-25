import AdminLayout from '@/components/Admin/AdminLayout'

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // The AdminLayout component will handle authentication checks
  return <AdminLayout>{children}</AdminLayout>
}
