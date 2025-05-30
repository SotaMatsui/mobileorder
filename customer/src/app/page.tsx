import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <p className="text-4xl">Welcome</p>
      <div className="flex">
        <Link href='/api/auth/signin'>
          <div className="p-2 m-0.5 min-w-16 text-center bg-foreground rounded-sm text-background hover:cursor-pointer hover:bg-foreground/90">
            Login
          </div>
        </Link>
        <Link href='/register'>
          <div className="p-2 m-0.5 min-w-16 text-center bg-foreground/10 rounded-sm text-foreground hover:cursor-pointer hover:bg-foreground/5">
            Register
          </div>
        </Link>
      </div>
    </div>
  );
}
