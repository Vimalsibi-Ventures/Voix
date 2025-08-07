import { LanguageTranslator } from '@/components/language-translator';
import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-body">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center space-x-4">
          <Icons.logo className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            LinguaWeave
          </h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <LanguageTranslator />
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Powered by Genkit. Your text is not stored on our servers after translation.
          </p>
        </div>
      </footer>
    </div>
  );
}
