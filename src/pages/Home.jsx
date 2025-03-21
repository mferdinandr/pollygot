import React, { useState } from "react";
import Layout from "../Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox } from "@/components/combobox";
import { OpenAI } from "openai";
import Output from "@/components/output";
import BubbleChat from "@/components/bubbleChat";

const Home = () => {
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text || !selectedLanguage) {
      return;
    }

    fetchTranslate({ text, selectedLanguage });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!chatText) {
      return;
    }

    fetchChat({ chat: chatText });
    setMessages([...messages, { content: chatText, isUser: true }]);
    setChatText("");
  };

  console.log("haha", messages);

  async function fetchTranslate({ text, selectedLanguage }) {
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

  async function fetchChat({ chat }) {
    const messages = [
      {
        role: "system",
        content:
          "You are a practitioner who can converse in multiple languages as per the user's preference. Simply respond in the same language the user uses",
      },
      {
        role: "user",
        content: chat,
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: response.choices[0].message.content, isUser: false },
      ]);
    } catch (err) {
      console.log("Error : ", err);
    }
  }

  return (
    <Layout>
      <div className="h-full overflow-y-auto">
        <Tabs defaultValue="translate" className="p-2 w-full">
          <TabsList className={"fixed z-10"}>
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent
            value="translate"
            className="justify-between h-screen flex flex-1 flex-col"
          >
            <form onSubmit={handleSubmit}>
              <h1 className="font-bold text-xl py-1 mt-11">
                Text To Translate
              </h1>
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
          <TabsContent value="chat" className={"flex flex-col relative"}>
            <div className="mt-9 mb-12">
              {messages.map((message, index) => (
                <BubbleChat key={index} isUser={message.isUser}>
                  {message.content}
                </BubbleChat>
              ))}
            </div>

            <form
              className="flex fixed bottom-[21px] py-2 px-3 right-7 rounded-md bg-white left-4 gap-3"
              onSubmit={handleSendMessage}
            >
              <input
                type="text"
                className="border w-full rounded-sm border-black p-2 text-sm"
                value={chatText}
                onChange={(value) => setChatText(value.target.value)}
              />
              <button className="bg-cyan-500 px-4 py-1 rounded-lg">Send</button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Home;
