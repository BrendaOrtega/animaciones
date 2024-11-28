import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { ScrollReveal } from "./Hero";
import { CardBody, CardContainer, CardItem } from "../components/3dcard";

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-20 xl:py-[120px]">
      <h2 className="text-dark dark:text-white text-3xl md:text-4xl lg:text-5xl text-center 	text-evil font-bold">
        Qué dicen nuestros estudiantes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  mt-12 md:mt-16 gap-8 lg:gap-y-12 xl:gap-12">
        <Comment
          image="https://pbs.twimg.com/profile_images/456497156975644673/QmpE5sMs_400x400.jpeg"
          name="Rodrigo"
          tag="@Alientres"
          comment="Hola, tomé un curso con @FixterGeek Desarrollo Web Full-Stack, me gusto la forma de explicar del profesor y las mentorías personalizadas, también las tecnologías aprendidas son de vanguardia. ¡Se los recomiendo!"
        />
        <Comment
          image="https://pbs.twimg.com/profile_images/1640439802104369153/P4m1BLS7_400x400.jpg"
          name="Jonathan"
          tag="@johnxgear"
          comment="Creo que una de las mejores decisiones ha sido tomar un curso en @FixterGeek es una buena forma de aprender / retomar la programación sin duda una gran experiencia, gracias por dejarme ser parte de esta comunidad. 😎🔥🙌🏼"
        />
        <Comment
          image="https://pbs.twimg.com/profile_images/1363555823138590724/BSg51cKM_400x400.jpg"
          name="Brenda Ortega"
          tag="@brendaojs"
          comment="En 2016, aprendí frontend en @FixterGeek, era la primera vez que veía la terminal así que fue un poco doloroso pero satisfactorio. 6 años más tarde, después de varios empleos y mucho aprendizaje puedo decir que fue la mejor decisión que he tomado. 👩🏻‍💻😊"
        />
        <Comment
          image="https://pbs.twimg.com/profile_images/1605726489055334400/olSwWtH8_400x400.jpg"
          name="David Duran Valdes"
          tag="@DavidDuranVal"
          comment="La forma de enseñar de @HectorBlisS @FixterGeek junto con la documentación y los lerning's son de gran ayuda para resolver los ejercicios y proyectos del curso, los temas parecen mas faciles de lo que son y te motivan a seguir aprendiendo, practicando y mejorar tus conocimientos."
        />
        <Comment
          image="https://pbs.twimg.com/profile_images/1509233081194004490/hwUK6HvV_400x400.jpg"
          name="Sandy"
          tag="@SandHv"
          comment="@FixterGeek ha sido una experiencia agradable y nutritiva técnicamente hablando, continuaré con los siguientes cursos para seguir retroalimentando y aprendiendo las nuevas técnicas del mundo de desarrollo web, gracias fixter ✨🐥👩🏻‍💻
"
        />
        <Comment
          image="https://pbs.twimg.com/profile_images/1659370175546765314/NQtKyiWa_400x400.jpg"
          name="Gustavo"
          tag="@kinxori"
          comment="Hi everyone! As you may know, I am in the journey to become a former web developer! I've started taking bootcamps with 
@FixterGeek
 and it's been a great experience. We have access to mentorships through all the course lapse and to be fair, Bliss has a natural talent to teach! 👨‍💻"
        />
      </div>
    </section>
  );
};

const Comment = ({
  image,
  comment,
  name,
  tag,
  className,
}: {
  image?: string;
  comment: ReactNode;
  name: string;
  tag: string;
  className?: string;
}) => {
  return (
    <ScrollReveal>
      <CardContainer className="inter-var ">
        <CardBody
          className={twMerge(
            "col-span-1 border border-lightGray dark:border-lightGray/10 rounded-2xl p-4 relative cursor-pointer hover:shadow-[0_16px_16px_rgba(0,0,0,0.05)] dark:hover:shadow-lg transition-all",
            className
          )}
        >
          <img
            className="absolute right-3 w-8 md:w-12 opacity-50 dark:brightness-100 dark:hidden	"
            src="/x.png"
          />

          <img
            className="absolute right-3 w-8 md:w-12 opacity-20 dark:block 	"
            src="/x-w.png"
          />

          <CardItem as="p" translateZ="100" className="mt-14">
            <span className="text-base md:text-lg text-iron dark:text-metal font-light mt-8 md:mt-12 xl:mt-16">
              "{comment}"
            </span>
          </CardItem>

          <CardItem
            translateZ="40"
            className="mt-6 md:mt-10 flex gap-3 items-center"
          >
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={
                image
                  ? image
                  : "https://images.pexels.com/photos/1181352/pexels-photo-1181352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
            />

            <div>
              <h4 className="text-dark dark:text-metal">{name}</h4>
              <p className="text-sm text-iron dark:text-white/30 font-light">
                {tag}
              </p>
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </ScrollReveal>
  );
};
