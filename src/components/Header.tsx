import GitHub from './Github'

const Header = () => <div class='bg-[#0b74d6] h-[52px] p-[10px] flex justify-between'>
  <div class='text-[#f1f1f1]'>
    <span class='mr-[4px] text-[#b2e5ce]'>Go2Type</span>
    <span class='text-xs mr-[10px]'>Transpiler from Go Structure to Typescript type</span>
    <span class='text-[#cbbcf4] text-xs'>Copy: (Ctrl/Cmd)+S </span>
  </div>
  <GitHub />
</div>

export default Header
