import React, { useEffect, useRef } from "react";

const NetworkGraph = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const header = document.querySelector(".header"); // Get header height
    if (!header) return;

    canvas.width = header.clientWidth;
    canvas.height = header.clientHeight;

    // Adjust number of nodes based on screen width
    const numNodes = window.innerWidth < 768 ? 20 : 40;

    const nodes = Array.from({ length: numNodes }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      radius: 6,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw edges (lines)
      nodes.forEach((node, i) => {
        nodes.forEach((target, j) => {
          if (i !== j) {
            const dist = Math.hypot(node.x - target.x, node.y - target.y);
            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(target.x, target.y);
              ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 150})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      // Draw nodes (circles)
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "cyan";
        ctx.fill();
      });

      update();
      requestAnimationFrame(draw);
    }

    function update() {
      nodes.forEach((node) => {
        node.x += node.dx;
        node.y += node.dy;

        // Bounce on edges
        if (node.x < 0 || node.x > canvas.width) node.dx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.dy *= -1;
      });
    }

    draw();

    return () => {
      cancelAnimationFrame(draw);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-canvas"></canvas>;
};

export default NetworkGraph;
