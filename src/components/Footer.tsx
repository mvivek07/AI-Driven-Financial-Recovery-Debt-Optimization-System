export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gradient-to-r from-primary/5 via-blue-600/10 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RelentlessAI. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/home" className="hover:underline">Home</a>
            <a href="/dashboard" className="hover:underline">Dashboard</a>
            <a href="/upload" className="hover:underline">Upload</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


