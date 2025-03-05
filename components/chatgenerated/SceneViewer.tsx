"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Video, X } from "lucide-react";

interface VideoScene {
  id: number;
  description: string;
  duration: string;
  visualElements: string[];
}

interface SceneViewerProps {
  selectedScenes: VideoScene[];
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: (value: boolean) => void;
}

export default function SceneViewer({ selectedScenes, isSidePanelOpen, setIsSidePanelOpen }: SceneViewerProps) {
  return (
    <AnimatePresence>
      {isSidePanelOpen && (
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 shadow-xl rounded-xl overflow-hidden h-[60vh] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 text-pink-400 mr-2" />
                  Generated Scenes
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setIsSidePanelOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
              {selectedScenes.map((scene) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: scene.id * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-lg text-pink-400">Scene {scene.id}</h3>
                    <div className="flex items-center text-sm bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30">
                      <Clock className="h-3 w-3 mr-1" />
                      {scene.duration}
                    </div>
                  </div>

                  <div className="mb-4 bg-black/20 p-3 rounded-lg border border-white/10">
                    <h4 className="text-sm font-medium mb-1 text-white/90">Description:</h4>
                    <p className="text-sm text-white/80">{scene.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 text-white/90">Visual Elements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scene.visualElements.map((element, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-2 py-1 rounded-full border border-white/10"
                        >
                          {element}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>

            <CardFooter className="border-t border-white/10 p-4">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg">
                Generate Full Video
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
