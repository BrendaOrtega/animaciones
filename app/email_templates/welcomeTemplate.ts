export const welcomeTemplate = ({ link }: { link: string }) => `

<html>
<head>
  <title>¡Todos los tutoriales son tuyos!</title>
</head>
<body style="font-family:Arial;">
      <a style="color:black;text-decoration:none;" target="_blank" href="https://www.fixtergeek.com">
    <img style="width:150px;" src="https://i.imgur.com/r1KXon5.png" />
  </a>
<div id=":rl" class="Am Al editable LW-avf tS-tW" hidefocus="true" aria-label="Cuerpo del mensaje" g_editable="true" role="textbox" aria-multiline="true" contenteditable="true" tabindex="1" style="direction: ltr; min-height: 639px;" itacorner="6,7:1,1,0,0" spellcheck="false" aria-owns=":v1" aria-controls=":v1"><div style="font-size:22px;color:#4D5562;padding:16px 0 4px 0; font-family:Helvetica; font-weight:400;">
Bienvenido geek! 🎉🍾🤓 🪄 Aquí tienes tu varita mágica.
<br></div>
  <div style="font-weight:bold;font-size:26px; margin-top:16px" >
  Ahora, ya puedes ver todos los tutoriales 🥳 📺</div>
<div style="font-size:18px;color:#4D5562;padding:16px 0 4px 0; font-family:Helvetica; font-weight:300;">
Si tienes alguna duda o pregunta, no dudes en responder este correo. 
  <br/>
  <br/>
  Nos vemos adentro, para construir componentes animados. 🪄🎩
      <br >
  <strong style="font-size:1.3rem;color:#5158F6;">
¡No esperes más y corre a ver el primero video!
  </strong>
    <br>
</div>
  <br/>
  <p style="font-size:18px;font-weight:bold;">
  Mira el video de bienvenida: <br/> ${link}
  </p>

</div></div>
</body>
</html>


`;
