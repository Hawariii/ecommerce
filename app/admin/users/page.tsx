import { getAdminUsers } from "@/lib/data";
import { Card } from "@/components/ui/card";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Kelola user</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="flex items-center justify-between p-5">
            <div>
              <p className="font-semibold text-slate-950">{user.name ?? "Tanpa nama"}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <p className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">{user.role}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
