#!/usr/bin/env python3
"""Fix the feed.html HTML structure."""

with open('feed.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken section
old = """                    </div>
                 </div>


                 
      <div id="modalTriggerPoint"></div>
    </div>

    <div id="justinePopup" class="justine-popup hidden">
      <div class="popup-box">
        <p class="popup-text">
          "Everyone is posting something…  
          Maybe I should too."
        </p>
        <button id="popupPostBtn">Post something</button>
           </div>
             </div>

         </div>
       </div>
               <div class="bottom-navigation">"""

new = """                    </div>
                    <div id="modalTriggerPoint"></div>
                 </div>

                 <div id="justinePopup" class="justine-popup hidden">
                   <div class="popup-box">
                     <p class="popup-text">
                       "Everyone is posting something…  
                       Maybe I should too."
                     </p>
                     <button id="popupPostBtn">Post something</button>
                   </div>
                 </div>

                 <div class="bottom-navigation">"""

content = content.replace(old, new)

with open('feed.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ Fixed!')
