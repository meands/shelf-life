import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import { Box, Button, Paper } from "@mantine/core";

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
}

export function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isVideoElementReady, setIsVideoElementReady] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const startScanner = async () => {
    try {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current as Element,
            constraints: {
              facingMode: "environment",
            },
          },
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader",
              "upc_reader",
              "upc_e_reader",
            ],
          },
        },
        () => {
          Quagga.start();
          setIsScanning(true);
        }
      );

      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          onDetected(result.codeResult.code);
          stopScanner();
        }
      });
    } catch (err) {
      console.error("Failed to initialize barcode scanner:", err);
    }
  };

  const stopScanner = () => {
    Quagga.stop();
    setIsScanning(false);
  };

  useEffect(() => {
    if (videoRef.current) {
      setIsVideoElementReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isVideoElementReady) return;

    startScanner();

    return () => {
      stopScanner();
    };
  }, [isVideoElementReady]);

  return (
    <Paper p="md" shadow="sm">
      <Box
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "640px",
          height: "480px",
          position: "relative",
          overflow: "hidden",
        }}
      />

      {isScanning ? (
        <Button onClick={stopScanner} fullWidth mt="sm" color="red">
          Cancel Scanning
        </Button>
      ) : (
        <Button onClick={startScanner} fullWidth mt="sm" color="green">
          Start Scanning
        </Button>
      )}
    </Paper>
  );
}
