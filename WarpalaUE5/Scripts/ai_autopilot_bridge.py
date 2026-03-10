import unreal
import os
import time

# Šis ir Warpala AI Autopilots Unreal Engine 5 videi.
# Tas pastāvīgi skatās uz "command.py" failu. 
# Ja AI (Gemini) tur kaut ko ieraksta, šis skripts to automātiski izpilda un izdzēš failu.

COMMAND_FILE = "C:/3d/WarpalaUE5/Scripts/command.py"

def check_for_ai_commands(*args):
    if os.path.exists(COMMAND_FILE):
        try:
            with open(COMMAND_FILE, 'r') as f:
                script_content = f.read()
            
            if script_content.strip():
                unreal.log("🤖 Warpala AI Autopilot: Executing new command...")
                
                # Izpilda AI doto kodu
                exec(script_content, globals())
                
                # Iztīra failu pēc izpildes
                with open(COMMAND_FILE, 'w') as f:
                    f.write("")
        except Exception as e:
            unreal.log_error(f"🤖 Warpala AI Autopilot Error: {str(e)}")

# Reģistrējam funkciju Unreal dzinēja "Tick" ciklā, lai tā vienmēr klausītos fonā
try:
    unreal.unregister_slate_post_tick_callback(tick_handle)
except:
    pass

tick_handle = unreal.register_slate_post_tick_callback(check_for_ai_commands)

unreal.log("=====================================================")
unreal.log("🟢 WARPALA AI AUTOPILOT IS NOW ONLINE AND LISTENING")
unreal.log("=====================================================")
