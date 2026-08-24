import { Mail, MapPin, Phone } from "lucide-react";

function VkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.049 2.303 3.847 2.896 3.847.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.181-3.626 2.181-3.626.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-brass/20 bg-graphite text-milk">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 md:gap-12 md:px-8 md:py-20">
        <div>
          <p className="font-serif text-2xl tracking-tight text-milk md:text-[1.75rem]">
            Valentin
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-milk/55">
            Кухни премиум-сегмента по индивидуальным размерам, прихожие и
            люксовые диваны.
          </p>
        </div>

        <div className="space-y-3 text-sm text-milk/70">
          <p className="text-xs uppercase tracking-[0.16em] text-brass-soft">
            Контакты
          </p>
          <a
            href="tel:+79202005124"
            className="flex items-center gap-2 hover:text-milk"
          >
            <Phone className="h-4 w-4 text-brass" />
            +7 (920) 200-51-24
          </a>
          <a
            href="mailto:valentinksalon@mail.ru"
            className="flex items-center gap-2 hover:text-milk"
          >
            <Mail className="h-4 w-4 text-brass" />
            valentinksalon@mail.ru
          </a>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
            Белгород, ул. Донецкая 85А · МЦ «Мебельный город», 2 этаж
          </p>
        </div>

        <div className="space-y-3 text-sm text-milk/70">
          <p className="text-xs uppercase tracking-[0.16em] text-brass-soft">
            Навигация
          </p>
          <div className="flex flex-col gap-2">
            <a href="/#projects" className="hover:text-milk">
              Наши проекты
            </a>
            <a href="/#reviews" className="hover:text-milk">
              Отзывы
            </a>
            <a href="/#stages" className="hover:text-milk">
              Этапы работы
            </a>
            <a href="/catalog" className="hover:text-milk">
              Каталог
            </a>
            <a href="/#before-after" className="hover:text-milk">
              Пространство
            </a>
            <a href="/#contacts" className="hover:text-milk">
              Контакты
            </a>
            <a href="/privacy" className="hover:text-milk">
              Политика конфиденциальности
            </a>
          </div>
          <a
            href="https://vk.ru/club143735775"
            className="inline-flex items-center gap-2 pt-2 hover:text-milk"
            target="_blank"
            rel="noreferrer"
          >
            <VkIcon className="h-4 w-4 text-brass" />
            ВКонтакте
          </a>
        </div>
      </div>
      <div className="border-t border-brass/15 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-xs text-milk/35 md:px-8">
        © {new Date().getFullYear()} Valentin. Архитектура интерьера.{" "}
        <a href="/privacy" className="hover:text-milk/60">
          Персональные данные
        </a>
      </div>
    </footer>
  );
}
