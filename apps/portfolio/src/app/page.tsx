"use client";
import CursorTracker from "@/components/common/cursor-div";
import DivSlider from "@/components/common/div-slider";
import { motion } from "framer-motion";
import {
  ArrowUpRightIcon,
  LaptopMinimalIcon,
  SquareTerminalIcon,
  TabletSmartphoneIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DELAY = 0.5;
export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <DivSlider />
      <CursorTracker />
      <main>
        <div className="h-screen w-screen overflow-x-hidden">
          <nav className="h-20 w-full border-b absolute top-0 right-0 z-[100] bg-background">
            <ul>
              <Link href="#home">
                <li>Home</li>
              </Link>
              <Link href="#services">
                <li>services</li>
              </Link>
            </ul>
          </nav>
          <motion.section
            id="home"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: DELAY }}
            className="h-full w-full bg-background after:absolute after:inset-0 after:z-10 after:-bottom-96 after:[background:linear-gradient(to_top,rgb(var(--background))_30%,transparent)] overflow-hidden relative"
            style={{
              backgroundImage:
                "url('https://infolio-nextjs.vercel.app/light/assets/imgs/patterns/lines1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              opacity: 0.2,
            }}
          >
            <div className="max-w-[480px] md:max-w-[80%] m-auto h-full flex justify-center items-center">
              <h1 className="flex flex-col items-center justify-center text-[10vw] font-bold">
                <span>{"I'm a Software"}</span>
                <span>Engineer</span>
              </h1>
            </div>
          </motion.section>
          <section id="services" className="pt-[140px] px-20">
            <div className="flex flex-col gap-8 mb-20">
              <h6 className="text-sm uppercase font-semibold">
                Our Specialize
              </h6>
              <div className="py-4 border-t flex items-center justify-between">
                <h2 className="text-5xl">
                  <strong>What We</strong> Offer
                </h2>
                <Link href="#">View All services</Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border rounded-xl p-10 flex flex-col gap-8">
                <LaptopMinimalIcon size={50} />
                <h3 className="text-3xl font-bold">Web Development</h3>
                <p>
                  Live workshop where we define the main problems and challenges
                  before building a strategic plan moving forward.
                </p>
                <p className="flex gap-4">
                  <span>Read Mode</span>{" "}
                  <img
                    src="https://infolio-nextjs.vercel.app/light/assets/imgs/arrow-right.png"
                    alt=""
                    width={20}
                    height={20}
                  />
                </p>
              </div>
              <div className="border rounded-xl p-10 flex flex-col gap-8">
                <TabletSmartphoneIcon size={50} />
                <h3 className="text-3xl font-bold">App Development</h3>
                <p>
                  Live workshop where we define the main problems and challenges
                  before building a strategic plan moving forward.
                </p>
                <p className="flex gap-4">
                  <span>Read Mode</span>{" "}
                  <img
                    src="https://infolio-nextjs.vercel.app/light/assets/imgs/arrow-right.png"
                    alt=""
                    width={20}
                    height={20}
                  />
                </p>
              </div>
            </div>
          </section>
          <section id="about" className="pt-[140px] px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex gap-4 items-center">
                <p className="flex flex-col items-start text-2xl w-[120px]">
                  <span>2</span>{" "}
                  <span className="text-xl">years of experience</span>
                </p>
                <Image
                  src="/profile.webp"
                  alt="logo"
                  width={300}
                  height={300}
                  className="rounded-xl"
                />
              </div>

              <div className="py-4 flex flex-col gap-8">
                <h2 className="text-xl">About Me</h2>
                <h3 className="text-3xl font-semibold">Software Engineer</h3>
                <p>
                  We shifted our talents to frontier science because we wanted
                  our work to have tangible, human-positive impact.
                </p>
              </div>
            </div>
          </section>
          <section id="about" className="pt-[140px] px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="py-4 flex flex-col gap-8">
                <h2 className="text-xl">About Me</h2>
                <h3 className="text-3xl font-semibold">Software Engineer</h3>
                <p>
                  We shifted our talents to frontier science because we wanted
                  our work to have tangible, human-positive impact.
                </p>
              </div>
            </div>
          </section>
        </div>
        {/* <div className="h-10 bg-transparent" /> */}
      </main>
    </div>
  );
}
