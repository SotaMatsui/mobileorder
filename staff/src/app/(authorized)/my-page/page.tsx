import { auth } from '@/auth';
import { SignOutButton } from '@/components/signoutButton';
import TitleBar from '@/components/titlebar';

export default async function MyPage() {
  const session = await auth();
  console.log('session', session);
  return (
    <div className="min-h-screen">
      <TitleBar title="マイページ" />
      <main className='flex min-h-screen flex-col items-center'>
        <div className='flex flex-col'>
          <div className='bg-foreground/10 rounded-tl-md rounded-tr-md px-2 py-1.5 text-sm'>
            現在のセッション
          </div>
          <pre className='bg-foreground/5 rounded-bl-md rounded-br-md p-2'>
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        <SignOutButton />
      </main>
    </div>
  );
}
