import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

type CtaBandeauProps = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  href: string;
  sectionId: string;
};

export function CtaBandeau({ title, subtitle, buttonLabel, href, sectionId }: CtaBandeauProps) {
  return (
    <section className="bg-primary py-24" aria-labelledby={sectionId}>
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <FadeIn>
          <h2 id={sectionId} className="font-heading text-4xl text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 font-sans text-lg text-white/80">{subtitle}</p>
          <Link
            href={href}
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "mt-10 border-white bg-transparent font-sans font-semibold text-white hover:!bg-white/10 hover:!text-white",
            )}
          >
            {buttonLabel}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
