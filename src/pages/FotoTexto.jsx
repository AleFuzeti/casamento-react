// src/components/FotoTexto.jsx
const FotoTexto = ({ imagem, alt, titulo, children, reverse }) => (
    <section style={{ flexDirection: reverse ? 'row-reverse' : 'row' }} className="foto-texto">
    {imagem  && (
      <div className="container-foto">
        <img src={imagem} alt={alt} />
      </div>
    )}
      <div className="container-texto">
        <h2>{titulo}</h2>
        {children}
      </div>
    </section>
  );
export default FotoTexto;  