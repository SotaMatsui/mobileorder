import { auth } from '@/auth';

export default async function MyPage() {
  const session = await auth();
  console.log('session', session);
  return (
    <main className='flex min-h-screen flex-col items-center'>
      <h1 className='my-6 text-center text-2xl'>Start Your Order</h1>
    </main>
  );
}
