interface HomeProps {
  poolCount: number;
  guessesCount: number;
  usersCount: number;
}
import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import avatarImg from "../assets/users-avatar-example.png";
import iconCheck from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";
export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });
      console.log(response);
      const { code } = response.data;
      await navigator.clipboard.writeText(code);
      alert(
        "Bolão criado com sucesso, o código foi copiado para área de transfência"
      );
      setPoolTitle("");
    } catch (err) {
      alert("Falha ao criar bolão");
    }
  }
  return (
    <div
      className="max-w-[1124px] h-screen mx-auto grid grid-cols-2  gap-28 
    items-center"
    >
      <main>
        <Image src={logoImg} alt="" quality={100} />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={avatarImg} alt="" quality={100} />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount} </span>pessoas
            já estão usando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-igniteYellow-500 px-6 py-4 rounded text-sm font-bold uppercase text-gray-900"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="" quality={100} />
    </div>
  );
}
export const getServerSideProps = async () => {
  const [responsePoolCount, responseGuessesCount, responseUsersCount] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);
  return {
    props: {
      poolCount: responsePoolCount.data.count,
      guessesCount: responseGuessesCount.data.count,
      usersCount: responseUsersCount.data.count,
    },
  };
};
