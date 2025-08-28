# 3D Enhancement Migration Diffs

## Modified: src/pages/Index.tsx

```diff
@@ -1,10 +1,14 @@
 import { useEffect, useState, useRef } from 'react';
 import { useNavigate } from 'react-router-dom';
 import FadeIn from '@/components/animations/FadeIn';
+import ThreeBackground from '@/components/ThreeBackground';
 import { Camera, Share2, Shield, Smartphone, Users, Zap, Building, TrendingUp, Target, Twitter, Instagram, Facebook, Linkedin, Youtube, Github } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import DarkModeToggle from '@/components/DarkModeToggle';
 import SignInModal from '@/components/SignInModal';
 import { updateSEOTags, SEO_CONFIGS } from '@/utils/seoUtils';
 import { getImagePath } from '@/lib/utils';
+// Import 3D core for initialization
+import { init3D } from '@/scripts/3d-core';

 const Index = () => {
@@ -19,6 +23,9 @@ const Index = () => {
   useEffect(() => {
     // Set SEO meta tags
     updateSEOTags(SEO_CONFIGS.home);
+    
+    // Initialize 3D system
+    init3D();
     
     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
@@ -248,12 +255,17 @@ const Index = () => {

   return (
-    <main className="relative min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:to-black">
+    <main className="scene relative min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:to-black">
+      {/* Advanced 3D Background - Only renders in Advanced mode */}
+      <div className="layer absolute inset-0" data-depth="0">
+        <ThreeBackground 
+          effect="particles" 
+          theme="electric" 
+          intensity={0.3}
+          interactive={true}
+        />
+      </div>
+      
       {/* Header */}
-      <header className="fixed top-0 left-0 right-0 z-50 glass-panel py-4">
+      <header className="layer fixed top-0 left-0 right-0 z-50 glass-panel py-4 shadow-layered-md" data-depth="2">
         <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
@@ -262,7 +274,7 @@ const Index = () => {
           {/* Desktop Navigation */}
           <div className="hidden md:flex items-center space-x-8">
             <button 
               type="button"
-              className="text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded"
+              className="nav-3d text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded focus-3d"
               onClick={() => scrollToSection('home')}
               title="Go to Home section"
             >
@@ -270,7 +282,7 @@ const Index = () => {
             </button>
             <button 
               type="button"
-              className="text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded"
+              className="nav-3d text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded focus-3d"
               onClick={() => scrollToSection('features')}
               title="View Features section"
             >
@@ -301,7 +313,7 @@ const Index = () => {
             <Button 
               variant="outline" 
               size="sm"
-              className="ml-4 glass-button electric-border electric-accent hover:electric-bg hover:text-white"
+              className="btn-3d press-depth ml-4 glass-button electric-border electric-accent hover:electric-bg hover:text-white focus-3d"
               onClick={() => setIsSignInModalOpen(true)}
               title="Sign in to your account"
             >
@@ -327,9 +339,14 @@ const Index = () => {

       {/* Hero */}
-      <section className="relative min-h-screen flex items-center overflow-hidden" id="home">
-        <div className="absolute inset-0 z-0">
+      <section className="scene-far relative min-h-screen flex items-center overflow-hidden" id="home">
+        <div className="layer absolute inset-0 z-0" data-depth="0" data-parallax="0.05">
           <img 
             src={getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')} 
@@ -343,8 +360,8 @@ const Index = () => {
           {/* <div className="absolute inset-0 bg-black/40"></div> */}
         </div>
         
-        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10 max-w-4xl">
-          <div className="max-w-3xl mx-auto text-center glass-card hero-card p-12 m-8">
+        <div className="layer container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10 max-w-4xl" data-depth="1" data-parallax="0.1">
+          <div className="card-3d-electric glass-3d max-w-3xl mx-auto text-center glass-card hero-card p-12 m-8 shadow-layered-lg">
             <FadeIn delay={200}>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-gradient-electric leading-tight mb-6 relative inline-block">
                 Laurence Photo Hub
@@ -364,14 +381,14 @@ const Index = () => {
             <FadeIn delay={400}>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button 
                   size="lg" 
-                  className="electric-bg text-white hover:electric-glow text-lg px-8 vision-pro-rounded apple-spring"
+                  className="btn-3d press-depth electric-bg text-white hover:electric-glow text-lg px-8 vision-pro-rounded apple-spring shadow-electric-md"
                   onClick={() => scrollToSection('features')}
                   title="Explore all features"
                 >
                   Explore Features
                 </Button>
                 <Button 
                   size="lg" 
                   variant="outline" 
-                  className="glass-button electric-border electric-accent hover:electric-bg hover:text-white text-lg px-8"
+                  className="btn-3d press-depth glass-button electric-border electric-accent hover:electric-bg hover:text-white text-lg px-8 shadow-layered-md"
                   onClick={() => scrollToSection('about')}
                   title="Learn more about Laurence Photo Hub"
                 >
@@ -404,10 +421,10 @@ const Index = () => {
             ))}
           </div>
         </div>
       </section>

       {/* Features */}
-      <section id="features" className="py-20 bg-gradient-to-br from-white to-blue-50/20 dark:bg-gray-900">
+      <section id="features" className="layer py-20 bg-gradient-to-br from-white to-blue-50/20 dark:bg-gray-900" data-depth="0" data-parallax="0.03">
         <div className="container mx-auto px-4 md:px-6">
-          <div className="max-w-3xl mx-auto text-center mb-16">
+          <div className="layer max-w-3xl mx-auto text-center mb-16" data-depth="1">
             <FadeIn>
               <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gradient-electric">Professional Features</h2>
             </FadeIn>
@@ -419,11 +436,11 @@ const Index = () => {
             </FadeIn>
           </div>
           
-          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
+          <div className="gallery-3d grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {features.map((feature, index) => (
-              <FadeIn key={index} delay={200 + index * 100}>
+              <FadeIn key={feature.id} delay={200 + index * 100}>
                 <div 
-                  className="glass-card p-6 text-center group cursor-pointer transition-transform hover:scale-105"
+                  className="card-3d gallery-item-3d glass-3d glass-card p-6 text-center group cursor-pointer shadow-layered-md contain-paint"
                   onClick={() => handleFeatureClick(feature.id)}
                   title={`View details for ${feature.title}`}
+                  data-depth="2"
                 >
@@ -441,7 +458,7 @@ const Index = () => {

       {/* About */}
-      <section id="about" className="py-20 bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:bg-gray-800">
+      <section id="about" className="layer py-20 bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:bg-gray-800" data-depth="0" data-parallax="0.02">
         <div className="container mx-auto px-4 md:px-6">
           <div className="max-w-4xl mx-auto">
@@ -458,7 +475,7 @@ const Index = () => {
                 <FadeIn delay={100}>
                   <div className="mb-6">
                     <img 
                       src={getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png')}
                       alt="Professional Photography" 
-                      className="w-full h-48 object-cover rounded-lg mb-4"
+                      className="gallery-item-3d w-full h-48 object-cover rounded-lg mb-4 shadow-layered-sm"
                     />
                   </div>
                   <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
@@ -479,7 +496,7 @@ const Index = () => {
               <div className="grid grid-cols-2 gap-4">
                 <FadeIn delay={300}>
                   <div 
-                    className="glass-card stats-card p-6 text-center cursor-pointer transition-transform hover:scale-105"
+                    className="card-3d-electric glass-3d glass-card stats-card p-6 text-center cursor-pointer shadow-layered-md contain-paint"
                     onClick={() => handleStatsClick('events')}
                     title="View event analytics"
+                    data-depth="2"
                   >

       {/* Gallery */}
-      <section id="gallery" className="py-20 bg-gradient-to-br from-purple-50/10 to-blue-50/20 dark:bg-gray-900">
+      <section id="gallery" className="layer py-20 bg-gradient-to-br from-purple-50/10 to-blue-50/20 dark:bg-gray-900" data-depth="0" data-parallax="0.04">
         <div className="container mx-auto px-4 md:px-6">
           <div className="max-w-6xl mx-auto">
             <FadeIn>
@@ -518,11 +535,11 @@ const Index = () => {
             </FadeIn>
             
-            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
+            <div className="gallery-3d grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               <FadeIn delay={100}>
-                <div className="glass-card enhance-3d overflow-hidden">
+                <div className="gallery-item-3d glass-3d glass-card overflow-hidden shadow-layered-md" data-depth="2">
                   <img 
                     src={getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png')}
                     alt="Event Photography" 
-                    className="w-full h-64 object-cover gallery-image"
+                    className="w-full h-64 object-cover"
                     onError={(e) => {

       {/* Footer */}
-      <footer className="py-12 px-6 border-t bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
+      <footer className="layer py-12 px-6 border-t bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" data-depth="0">
         <div className="max-w-7xl mx-auto">
           <div className="flex flex-col space-y-6">
@@ -601,7 +618,7 @@ const Index = () => {
             <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
               <div 
-                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity enhance-3d"
+                className="nav-3d flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity focus-3d"
                 onClick={() => handleFooterClick('logo')}
                 title="Go to homepage"
               >
@@ -610,15 +627,15 @@ const Index = () => {
               </div>
               <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                 <button 
                   onClick={() => handleFooterClick('privacy')} 
-                  className="hover:text-foreground transition-colors cursor-pointer enhance-3d"
+                  className="nav-3d hover:text-foreground transition-colors cursor-pointer focus-3d"
                   title="View privacy policy"
                 >
                   Privacy
                 </button>
                 <button 
                   onClick={() => handleFooterClick('terms')} 
-                  className="hover:text-foreground transition-colors cursor-pointer enhance-3d"
+                  className="nav-3d hover:text-foreground transition-colors cursor-pointer focus-3d"
                   title="View terms of service"
                 >
@@ -638,7 +655,7 @@ const Index = () => {
               <div className="flex items-center space-x-4">
                 <button
                   onClick={() => handleSocialClick('twitter')}
-                  className="social-icon-btn p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all enhance-3d"
+                  className="social-icon-btn p-2 rounded-full bg-white dark:bg-gray-700 shadow-layered-sm focus-3d"
                   aria-label="Follow us on Twitter"
                   title="Follow us on Twitter"
                 >

       {/* Camera Modal */}
       {isCameraModalOpen && (
-        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
-          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 glass-card">
+        <div className="layer fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center" data-depth="5">
+          <div className="card-3d glass-3d bg-white rounded-lg p-6 max-w-4xl w-full mx-4 glass-card shadow-layered-xl">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-gradient-electric">Camera</h2>
               <Button 
                 variant="outline" 
                 onClick={closeCamera}
-                className="glass-button"
+                className="btn-3d press-depth glass-button focus-3d"
               >
                 Close
               </Button>
@@ -748,7 +765,7 @@ const Index = () => {
                   <div className="flex justify-center space-x-4">
                     <Button 
                       onClick={capturePhoto}
-                      className="electric-bg text-white hover:electric-glow text-lg px-8 py-3 rounded-full"
+                      className="btn-3d press-depth electric-bg text-white hover:electric-glow text-lg px-8 py-3 rounded-full shadow-electric-md"
                     >
                       <Camera className="w-5 h-5 mr-2" />
                       Capture Photo
@@ -766,13 +783,13 @@ const Index = () => {
                   <div className="flex justify-center space-x-4">
                     <Button 
                       onClick={retakePhoto}
                       variant="outline"
-                      className="glass-button px-6 py-2"
+                      className="btn-3d press-depth glass-button px-6 py-2 focus-3d"
                     >
                       Retake
                     </Button>
                     <Button 
                       onClick={closeCamera}
-                      className="electric-bg text-white hover:electric-glow px-6 py-2"
+                      className="btn-3d press-depth electric-bg text-white hover:electric-glow px-6 py-2 shadow-electric-md"
                     >
                       Done
                     </Button>
```

## Modified: src/App.tsx

```diff
@@ -28,8 +28,12 @@ import TermsPage from "./pages/TermsPage";
 import PrivacyPage from "./pages/PrivacyPage";
 import NotFound from "./pages/NotFound";
+// Import 3D styles
+import './styles/3d-tokens.css';
+import './styles/3d-core.css';

 const queryClient = new QueryClient();

 const App = () => (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
```

## Modified: src/index.css

```diff
@@ -1,3 +1,7 @@
+/* Import 3D enhancement styles */
+@import './styles/3d-tokens.css';
+@import './styles/3d-core.css';
+
 @tailwind base;
 @tailwind components;
 @tailwind utilities;
```