import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Mic, Square, FileText, BarChart2, AlertCircle, CheckCircle2, Loader2, History, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

export default function PitchStudio() {
  const { user, isAuthenticated } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('record');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const saveMutation = trpc.pitch.save.useMutation({
    onSuccess: () => {
      toast.success('Pitch analysis saved successfully!');
      historyQuery.refetch();
    },
    onError: (error) => {
      toast.error('Failed to save analysis: ' + error.message);
    },
  });

  const historyQuery = trpc.pitch.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAnalysisResult(null);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const analyzePitch = () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      const result = {
        score: 85,
        clarity: 92,
        pacing: 78,
        persuasion: 88,
        transcript: "We are building the future of B2B SaaS acceleration. Our platform uses generative AI to optimize applications and connect founders with the right investors at the right time. Unlike traditional consultants, we offer a scalable, data-driven approach that aligns incentives through equity partnerships.",
        feedback: [
          { type: 'positive' as const, text: "Strong opening hook clearly stating the value proposition." },
          { type: 'positive' as const, text: "Excellent clarity and articulation throughout." },
          { type: 'improvement' as const, text: "Pacing was slightly fast in the middle section. Try pausing for emphasis after key points." },
          { type: 'improvement' as const, text: "Consider adding a specific metric or traction point to boost credibility." }
        ],
        recordingDuration: recordingTime,
      };
      
      setAnalysisResult(result);
      setActiveTab('analysis');

      // Save to database if authenticated
      if (isAuthenticated) {
        saveMutation.mutate(result);
      }
    }, 3000);
  };

  const viewHistoryItem = (item: any) => {
    setAnalysisResult({
      score: item.score,
      clarity: item.clarity,
      pacing: item.pacing,
      persuasion: item.persuasion,
      transcript: item.transcript,
      feedback: item.feedback,
      recordingDuration: item.recordingDuration,
    });
    setActiveTab('analysis');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="text-center space-y-4">
          <Mic className="w-16 h-16 text-purple-500 mx-auto opacity-50" />
          <h2 className="text-2xl font-bold">Sign in to use Pitch Studio</h2>
          <p className="text-muted-foreground max-w-md">
            Practice your pitch with our AI Coach and save your progress. Sign in to get started.
          </p>
        </div>
        <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Pitch Studio
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Practice your pitch with our AI Coach. Get real-time feedback on your delivery, pacing, and content to perfect your investor presentation.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="record">Record & Practice</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!analysisResult}>AI Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="mt-6">
          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle>Record Your Pitch</CardTitle>
              <CardDescription>
                Record a 1-3 minute elevator pitch. Speak clearly and at a natural pace.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-8">
              <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording ? 'bg-red-100 dark:bg-red-900/20 animate-pulse' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {isRecording ? (
                  <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-50 animate-ping"></div>
                ) : null}
                <Mic className={`w-16 h-16 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
              </div>

              <div className="text-4xl font-mono font-bold tabular-nums">
                {formatTime(recordingTime)}
              </div>

              {audioBlob && !isRecording && (
                <div className="w-full max-w-md bg-muted p-4 rounded-lg flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Pitch_Recording_{new Date().toLocaleDateString()}.webm</p>
                    <p className="text-xs text-muted-foreground">{formatTime(recordingTime)} • {(audioBlob.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setAudioBlob(null)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center gap-4 pb-8">
              {!isRecording ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-red-500 hover:bg-red-600 text-white min-w-[150px]"
                    onClick={startRecording}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                  {audioBlob && (
                    <Button 
                      size="lg" 
                      className="bg-purple-600 hover:bg-purple-700 text-white min-w-[150px]"
                      onClick={analyzePitch}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BarChart2 className="w-4 h-4 mr-2" />
                          Analyze Pitch
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="min-w-[150px]"
                  onClick={stopRecording}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          {analysisResult && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2 border-purple-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Overview</CardTitle>
                    <Badge variant={analysisResult.score >= 80 ? "default" : "secondary"} className="text-lg px-3 py-1">
                      Score: {analysisResult.score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Clarity</span>
                        <span className="font-bold">{analysisResult.clarity}%</span>
                      </div>
                      <Progress value={analysisResult.clarity} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pacing</span>
                        <span className="font-bold">{analysisResult.pacing}%</span>
                      </div>
                      <Progress value={analysisResult.pacing} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Persuasion</span>
                        <span className="font-bold">{analysisResult.persuasion}%</span>
                      </div>
                      <Progress value={analysisResult.persuasion} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" /> Transcript
                    </h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{analysisResult.transcript}"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.feedback
                      .filter((f: any) => f.type === 'positive')
                      .map((f: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                          {f.text}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-amber-600 dark:text-amber-400 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" /> Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.feedback
                      .filter((f: any) => f.type === 'improvement')
                      .map((f: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          {f.text}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" /> Pitch History
              </CardTitle>
              <CardDescription>
                Review your past pitch analyses and track your improvement over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : historyQuery.data && historyQuery.data.length > 0 ? (
                <div className="space-y-4">
                  {historyQuery.data.map((item) => (
                    <Card 
                      key={item.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow border-purple-500/10"
                      onClick={() => viewHistoryItem(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant={item.score >= 80 ? "default" : "secondary"}>
                                Score: {item.score}/100
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.transcript}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pitch analyses yet. Record your first pitch to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
