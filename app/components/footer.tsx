import { cn } from "~/lib/cn";
import { Link } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "~/hooks/use-scroll-direction";

export const Footer = ({ className }: { className?: string }) => {
  const scrollDirection = useScrollDirection();

  return (
    <AnimatePresence>
      {scrollDirection === "up" && (
        <motion.div
          className="fixed bottom-0 flex items-center justify-center w-full z-50"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={cn(
              "mx-auto w-full py-5 px-6 relative shadow-sm tap-highlight-transparent bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 outline-none",
              className
            )}
          >
            <span className="flex justify-between items-center">
              <span>
                &copy; 2024{" "}
                <Link
                  href="https://dodycode.com"
                  color="foreground"
                  className="font-bold"
                >
                  Dodycode
                </Link>
              </span>
              <span>
                Spot some bug?{" "}
                <Link
                  href="https://github.com/dodycode/remix-kdrama-tmdb/issues"
                  color="foreground"
                >
                  Submit an issue
                </Link>
              </span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
