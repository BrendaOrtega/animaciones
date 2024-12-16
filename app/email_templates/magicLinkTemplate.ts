export const magicLinkTemplate = ({ link }: { link: string }) => `

<html>
<head>
  <title>¡Todos los tutoriales son tuyos! 🔥</title>
</head>
<body style="font-family:Arial; background-color:#F8F8F8;padding:24px; ">
<div style="min-width:360px; max-width:480px; margin:0 auto;padding:24px; background-color:#ffffff; border-radius:24px;">
  <div >
    <img alt="logo" style="width:160px;" src="https://i.imgur.com/CSOCrRV.png"/>
  </div>
  <div style="text-align:left; background:white; border-radius:16px; margin-top:16px; ">
    <h2 style="color:#15191E; font-size:20px; margin-top:24px; line-height:140%">
    ¡Bienvenid@ de nuevo geek! 🤓
    </h2>
    <p style="margin-top:14px; color:#495466"> 
      Vuelve a entrar al curso: <strong>"Animaciones con React" </strong>   
    </p>
    <p style="margin-top:14px;color:#495466;"> 
       Aquí tienes tu magic link. <strong style="color:#5158f6;">
                                    Nos vemos dentro 🪄✨🎩🐰🤩
                                      </strong>
    </p> 
    <a href="${link}" target="_blank" rel="noreferrer" style="margin-top:24px;padding:12px 16px;border-radius:50px;background:#5158f6;color:white;font-weight:bold;text-decoration:none;display:inline-block;" >
    Abrir curso
    </a>
   <p style="margin-top:14px; color:#495466; margin-top:48px;"> 
     
    </p> 
    <p style="font-size:12px; color:#8391A1; margin-top:48px;">Si tienes alguna duda o pregunta, no dudes en responder este correo. </p>
  </div>
  
   <div style="text-align:left; margin-top:8px; margin-bottom:16px">
        <a href="https://www.facebook.com/fixterme" target="blank" style="text-decoration:none; "> 
          <img alt="facebook" style="width:24px; height:24px" src="https://i.imgur.com/JvkVAdP.png"/>
        </a>
           <a href="https://www.linkedin.com/company/28982942" target="blank" style="text-decoration:none;"> 
           <img alt="linkedin" style="width:24px; height:24px" src="https://i.imgur.com/Y8zd5tO.png"/>
        </a>
        <a href="https://twitter.com/FixterGeek" target="blank" style="text-decoration:none;"> 
           <img alt="twitter"  style="width:24px; height:24px" src="https://i.imgur.com/kGOfcQP.png"/>
        </a>
        </a>
            <a href="https://www.instagram.com/fixtergeek/" target="blank" style="text-decoration:none;"> 
           <img alt="instagram"  style="width:24px; height:24px" src="https://i.imgur.com/cqGKCq6.png"/>
        </a>
       <a href="https://www.youtube.com/@fixtergeek8057" target="blank" style="text-decoration:none;"> 
           <img alt="youtube"  style="width:24px; height:24px" src="https://i.imgur.com/S92vVcz.png"/>
      </a>
      </div>
  </div>
</body>
</html>


`;
