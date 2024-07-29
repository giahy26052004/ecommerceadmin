import Layout from "@/components/layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>Hello, <b>{session?.user?.email}</b></h2>
        <div className="flex bg-gray-300 gap-1 rounded-lg overflow-hidden text-black">
          <img
            className="w-6 h-6"
            src={session?.user?.image}
            alt={session?.user?.name}
          />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
