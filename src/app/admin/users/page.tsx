"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, UserX, UserCheck, ShieldAlert, Trash2 } from "lucide-react";

export default function ManageUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchUsers();
    }, [session]);

    const modifyUser = async (id: string, action: string) => {
        if (!confirm(`Are you sure you want to perform ${action} on this account?`)) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            });
            if (res.ok) {
                alert("Operation successful");
                fetchUsers();
            } else {
                alert("Operation failed");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm("CRITICAL WARNING: Are you sure you want to completely DELETE this user? All their animals and orders will also be deleted!")) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("User deleted");
                setUsers(users.filter((u) => u.id !== id));
            } else {
                alert("Could not delete user.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!session) return <div className="p-6">Loading session...</div>;
    if (loading) return <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4 mb-2">Monitor Accounts</h2>
                    <p className="text-gray-500 pl-4 max-w-xl text-sm">Review registered users, examine their submitted identity documents, promote admins, or manage bans and account deletion.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <th className="py-5 px-8">User Info</th>
                            <th className="py-5 px-8">Role</th>
                            <th className="py-5 px-8">KTP / Verification</th>
                            <th className="py-5 px-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                                <td className="py-5 px-8">
                                    <div className="font-bold text-gray-800 text-lg flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold border border-indigo-100">{u.name?.charAt(0) || "U"}</div>
                                        <div>
                                            {u.name || "Unnamed"}
                                            <div className="text-sm font-medium text-gray-400 mt-0.5">{u.email}</div>
                                        </div>
                                    </div>

                                </td>
                                <td className="py-5 px-8">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border
                                        ${u.role === 'ADMIN' ? 'bg-red-50 border-red-200 text-red-700' :
                                            u.role === 'SELLER' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                u.role === 'SUSPENDED' ? 'bg-gray-700 border-gray-900 text-white' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="py-5 px-8">
                                    {u.ktpUrl ? (
                                        <a href={u.ktpUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                                            🔍 View Image
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium">No Document</span>
                                    )}
                                </td>
                                <td className="py-5 px-8 text-right space-x-2">
                                    {u.id !== session.user.id && (
                                        <>
                                            {u.role !== 'SUSPENDED' ? (
                                                <button onClick={() => modifyUser(u.id, "SUSPEND")} className="p-2.5 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border border-orange-100 hover:border-orange-300" title="Suspend User">
                                                    <UserX size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => modifyUser(u.id, "RESTORE")} className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-100 hover:border-emerald-300" title="Restore User">
                                                    <UserCheck size={18} />
                                                </button>
                                            )}

                                            {u.role !== 'ADMIN' && u.role !== 'SUSPENDED' && (
                                                <button onClick={() => modifyUser(u.id, "PROMOTE_ADMIN")} className="p-2.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-100 hover:border-purple-300" title="Make Admin">
                                                    <ShieldAlert size={18} />
                                                </button>
                                            )}

                                            <button onClick={() => deleteUser(u.id)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100 hover:border-red-300" title="Delete User Forever">
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                    {u.id == session.user.id && (
                                        <span className="inline-block px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium border border-gray-200">You (Protected)</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">No users found in database.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
