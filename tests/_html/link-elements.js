const html = `
<a id="el-1" href="/First" data-hovercard="">First person. #1</a>
<a id="el-2" href="/First">Invalid link. #1</a>
<a id="el-3" href="/Second" data-hovercard=""><!-- Comment -->Second person #2.<!-- More comments... --></a>
<a id="el-4" href="/Second" data-hovercard=""><img src="" alt="">Invalid link. #2.</a>
<a id="el-5" href="/Third" data-hovercard="">Third person. #3</a>
<a id="el-6" href="/Third" data-hovercard=""><!-- Comment --><!-- More comments... -->Third person #3.</a>
`;

export default html;
