const fs = require('fs');
const path = require('path');

const files = [
  'pages/dashboardPage.tsx',
  'pages/certificatePage.tsx',
  'components/ui/Carousel.css',
  'components/LandingPage/verify.tsx'
];

const dir = 'd:\\Semester 6\\BC Certificate Verification\\frontend\\src';

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace tailwind arbitrary values [#4ca385] with primary-light
  content = content.replace(/\[#4ca385\]/g, 'primary-light');
  
  // Replace direct hex values with var(--primary-light)
  content = content.replace(/#4ca385/g, 'var(--primary-light)');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
