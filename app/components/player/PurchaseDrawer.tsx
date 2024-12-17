import { Form } from "@remix-run/react";
import { PrimaryButton } from "../PrimaryButton";
import { Drawer } from "../SimpleDrawer";
import { useState } from "react";

export const PurchaseDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Drawer
      header={<></>}
      cta={<></>}
      className="z-50"
      title="Desbloquea todo el curso"
      isOpen
    >
      <div className="pt-20 px-8  pb-8 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-4xl text-white">
            ¿List@ para crear animaciones? Prepárate porque apenas estamos
            comenzando 🚀🧙🏻
          </h3>
          <p className="text-xl font-light mt-16 text-metal">
            ¡Desbloquea el curso completo! 🫶🏻 Construye conmigo todos los
            componentes paso a paso y conviértete en un@ PRO de las animaciones.{" "}
            <br />
          </p>
        </div>
        <Form method="POST">
          <PrimaryButton
            // auto loading
            onClick={() => setIsLoading(true)}
            isLoading={isLoading}
            name="intent"
            value="checkout"
            type="submit"
            className="font-semibold w-full mt-20 hover:tracking-wide"
          >
            ¡Que siga la magia! 🎩🪄
          </PrimaryButton>
        </Form>{" "}
      </div>
    </Drawer>
  );
};
