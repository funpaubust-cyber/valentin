"use client";

import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";

const stages = [
  {
    id: "measure",
    title: "Замер",
    text: "Снимаем размеры в удобный для вас день — время выезда согласуем заранее.",
    image: "/images/real/stages/01-measure.jpg",
  },
  {
    id: "design",
    title: "Проектирование",
    text: "Готовим индивидуальный дизайн-проект: учитываем планировку, стиль и все ваши пожелания.",
    image: "/images/real/stages/02-design.jpg",
  },
  {
    id: "complete",
    title: "Комплектация проекта",
    text: "Подбираем фурнитуру, технику и комплектующие под бюджет проекта — от кухни до мягкой группы.",
    image: "/images/real/stages/03-complete.jpg",
  },
  {
    id: "produce",
    title: "Производство",
    text: "Изготовление занимает до 60 рабочих дней — срок зависит от материалов и сложности проекта.",
    image: "/images/real/stages/04-produce.jpg",
  },
  {
    id: "deliver",
    title: "Доставка",
    text: "Привозим в оговорённый срок; до отгрузки мебель хранится на складе готовой продукции фабрики.",
    image: "/images/real/stages/05-deliver.jpg",
  },
  {
    id: "install",
    title: "Установка",
    text: "Штатная команда сборщиков выполняет монтаж под ключ — кухни, прихожие и мягкие группы.",
    image: "/images/real/stages/06-install.jpg",
  },
] as const;

export function WorkStages() {
  return (
    <section id="stages" className="bg-milk py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brass">
            Как мы работаем
          </p>
          <h2 className="font-serif text-[1.85rem] text-graphite md:text-5xl">
            Этапы работы
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-graphite/55 md:text-base">
            Путь от замера до установки — для кухонь и корпусной мебели; мягкую
            группу подбираем и заказываем в салоне.
          </p>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          {stages.map((stage, i) => (
            <FadeIn key={stage.id} delay={0.04 * i}>
              <article className="group relative aspect-[4/3] overflow-hidden bg-walnut shadow-soft md:aspect-[16/11]">
                <Image
                  src={stage.image}
                  alt={stage.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                  sizes="(max-width:768px) 100vw, 50vw"
                  quality={88}
                />
                <div className="absolute inset-0 bg-graphite/45 transition-colors duration-500 group-hover:bg-graphite/55" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center md:px-10">
                  <h3 className="font-serif text-xl uppercase tracking-[0.06em] text-milk md:text-3xl">
                    {stage.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[0.8rem] leading-relaxed text-milk/85 md:mt-4 md:text-base">
                    {stage.text}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
