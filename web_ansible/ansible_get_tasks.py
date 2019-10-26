import json
import shutil
from collections import namedtuple
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase
import ansible.constants as C

class GetTasks():
    def get_task(self, playbook_name):
        loader = DataLoader() # Takes care of finding and reading yaml, json and ini files

        playbook_data=loader.load_from_file(f"/home/gilmar/ansible/{playbook_name}.yml")

        print(playbook_data)

        for data in playbook_data:
            if 'roles' in data:
                for role in data['roles']:
                    roles_data=loader.load_from_file(f"/home/gilmar/ansible/roles/{role}/tasks/main.yml")

                    #print(roles_data)

        return roles_data            
