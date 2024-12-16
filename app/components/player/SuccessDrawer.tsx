import { EmojiConfetti } from "../EmojiConfetti";
import { Drawer } from "../SimpleDrawer";

export const SuccessDrawer = ({
  isOpen,
  onClose,
}: {
  onClose?: () => void;
  isOpen?: boolean;
}) => {
  return (
    <>
      <EmojiConfetti />
      <Drawer
        header={<></>}
        cta={<></>}
        className="z-[100]"
        title="Desbloquea todo el curso"
        isOpen={isOpen}
        onClose={onClose}
        mode="big"
      >
        <div className="h-full flex items-center">
          <div className="mx-auto">
            <img src="/congrats.png" alt="logo" className="mx-auto w-[240px]" />
            <h2 className="text-2xl dark:text-white font-semibold md:text-4xl text-center pt-10 md:pt-20 text-white max-w-xl">
              ¡Tu acceso está listo! 🪄✨🎩🐰🤩 Ve por él, está en tu correo.
            </h2>
            <p className="md:max-w-xl text-lg text-metal dark:text-metal text-center font-light mt-6">
              Nos da gusto que seas parte de este curso. <br />A partir de hoy,
              tus páginas web nunca volverán a ser los mismos. <br />
              <strong>¡Que comience la magia! 🧙🏻🪄</strong>
            </p>
            <p className="text-sm  dark:text-metal text-metal text-center font-light mt-6">
              Pd. Si aún no recibiste tu acceso, escribenos:{" "}
              <a
                className="text-blue-500 hover:text-blue-600"
                rel="noreferrer"
                target="_blank"
                href="mailto:brenda@fixter.org"
              >
                brenda@fixter.org
              </a>{" "}
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
};
