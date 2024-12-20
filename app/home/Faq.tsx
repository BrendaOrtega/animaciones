import { AnimatePresence } from "framer-motion";
import { ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { ScrollReveal } from "./Hero";

export const Faq = () => (
  <ScrollReveal>
    <section className="lg:pt-[120px] lg:pb-[160px] pt-20 pb-[120px]">
      <h2 className=" text-dark  dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center">
        {" "}
        ¿Tienes alguna duda ? 🎨
      </h2>
      <p className="text-base md:text-lg text-iron dark:text-metal dark:font-extralight font-light mt-6 mb-16 text-center">
        Si no encuentras la respuesta que buscas por favor escríbenos por{" "}
        <a
          href="https://wa.me/525539599400"
          target="_blank"
          className="text-[#777DF7] underline"
        >
          whatsapp
        </a>
         .
      </p>
      <div className="mt-12 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 ">
        <div className="flex flex-col gap-8">
          <Question
            question="¿Cómo se imparte el curso?"
            answer="La modalidad del curso es 100% en línea, por lo que todo el contenido del curso (videos y learnings) se encuentra disponible desde tu perfil de forma permanente. Podrás verlos a tu ritmo: cuando quieras y desde donde quieras."
          />

          <Question
            question="¿Necesito conocimientos previos?"
            answer="Este curso es de nivel intermedio, por lo que sí requieres conocimientos en JavaScript y ReactJs. "
          />
          <Question
            question="¿Cómo funcionan los cursos? ¿Debo seguir un horario específico?"
            answer="No, los cursos son 100% online y offline, puedes cursarlos a tu ritmo: cuando quieras y desde donde quieras."
          />
          <Question
            question="¿Cómo puedo obtener futuras actualizaciones?"
            answer="Al comprar el curso tendrás acceso permanente a él, y a sus futuras actualizaciones sin pagos adicionales."
          />
        </div>
        <div className="flex flex-col gap-8">
          <Question
            question="¿Cómo compro el curso?"
            answer="Al dar clic en el botón Comprar curso, serás redirigido a flujo de compra con Stripe. Al completar la compra, recibirás en tu correo el link de acceso al curso."
          />
          <Question
            question="¿Qué formas de pago aceptan?"
            answer="Aceptamos todo tipo de tarjetas de crédito o tarjetas débito internacionales (Visa, MasterCard o AMEX) que estén habilitadas para pagos online al extranjero. Si no te es posible pagar por este medio, escríbenos a hola@fixtergeek.com y buscaremos otras opciones."
          />
          <Question
            question="¿Cuál es la diferencia entre el Full course y el Full course + Playera?"
            answer="El contenido de ambos cursos es el mismo, la única diferencia es que el Full course + Playera incluye la playera oficial de fixter. Después de tu compra, nos pondremos en contacto contigo para enviarla hasta la puerta de tu casa."
          />{" "}
          <Question
            question="¿Emiten factura fiscal?"
            answer="Sí, despues de suscribirte al Plan PRO completa tus datos fiscales desde tu perfil>Administrar plan y te haremos llegar tu fatura vía email, si tienes alguna duda escríbenos a brenda@fixter.org"
          />
        </div>
      </div>
    </section>
  </ScrollReveal>
);

export const Question = ({
  question,
  answer,
}: {
  question: string;
  answer: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  return (
    <div
      ref={ref}
      className="border-lightgray dark:border-lightGray/20   border-[1px] rounded-2xl"
    >
      <button
        className="w-full px-6 py-6 text-base md:text-xl font-medium text-left flex justify-between items-center"
        onClick={() => {
          setOpen((o) => !o);
        }}
      >
        <p className="w-[90%]  text-dark dark:text-white  ">{question}</p>
        {open ? (
          <IoIosArrowDown className="rotate-180 transition-all text-dark  dark:text-white " />
        ) : (
          <IoIosArrowDown className="transition-all text-dark  dark:text-white " />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          >
            <p className="text-base md:text-lg text-iron dark:text-metal  font-light px-6 pb-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
