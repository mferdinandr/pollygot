import React, { useState } from "react";
import Layout from "../Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox } from "@/components/combobox";
import { OpenAI } from "openai";
import Output from "@/components/output";

const Home = () => {
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text || !selectedLanguage) {
      return;
    }

    fetchReport({ text, selectedLanguage });
  };

  async function fetchReport({ text, selectedLanguage }) {
    const messages = [
      {
        role: "system",
        content:
          "You are a translator. Given text would like translated and specify language he want, write a the translate word. Just say the result",
      },
      {
        role: "user",
        content: `text would like translated: ${text}, specify the language i want it is ${selectedLanguage}`,
      },
    ];

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API,
        dangerouslyAllowBrowser: true,
      });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
      });
      setTranslatedText(response.choices[0].message.content);
    } catch (err) {
      console.log("Error:", err);
    }
  }

  return (
    <Layout>
      <div className="h-full overflow-y-auto">
        <Tabs defaultValue="translate" className="p-2 w-full">
          <TabsList>
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent
            value="translate"
            className="justify-between h-screen flex flex-1 flex-col"
          >
            <form onSubmit={handleSubmit}>
              <h1 className="font-bold text-xl py-1">Text To Translate</h1>
              <textarea
                placeholder="Insert your chat!"
                className="bg-black/10 w-full h-[100px] rounded-md p-2"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <h2 className="font-bold text-lg py-1">Select Language</h2>
              <Combobox
                value={selectedLanguage}
                onChange={(value) => setSelectedLanguage(value)}
              />
              <button
                type="submit"
                className="font-bold bg-blue-500 text-white px-3 py-1 rounded-md w-full mt-2"
              >
                Translate
              </button>

              <h1 className="font-bold text-xl py-1 mt-3">Translated</h1>
              <Output content={translatedText} />
            </form>
          </TabsContent>
          <TabsContent value="chat">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Home;
