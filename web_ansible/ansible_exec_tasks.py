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

class ResultsCollector(CallbackBase):
    def __init__(self, *args, **kwargs):
        super(ResultsCollector, self).__init__(*args, **kwargs)
        self.host_ok = []
        self.host_unreachable = []
        self.host_failed = []

    def v2_runner_on_unreachable(self, result, ignore_errors=False):
        name = result._host.get_name()
        task = result._task.get_name()
        #ansible_log(result)
        #self.host_unreachable[result._host.get_name()] = result
        self.host_unreachable.append(dict(ip=name, task=task, result=result))

    def v2_runner_on_ok(self, result,  *args, **kwargs):
        name = result._host.get_name()
        task = result._task.get_name()
        if task == "setup":
            pass
        elif "Info" in task:
            self.host_ok.append(dict(ip=name, task=task, result=result))
        else:
            #ansible_log(result)
            self.host_ok.append(dict(ip=name, task=task, result=result))

    def v2_runner_on_failed(self, result,   *args, **kwargs):
        name = result._host.get_name()
        task = result._task.get_name()
        #ansible_log(result)
        self.host_failed.append(dict(ip=name, task=task, result=result))

class ExecTasks():

    def exec_task(self, task):
        loader = DataLoader()
        inventory = InventoryManager(loader=loader, sources='localhost,')
        Options = namedtuple('Options', ['connection', 'module_path', 'forks', 'become', 'become_method', 'become_user', 'check', 'diff'])
        options = Options(connection='local', module_path=['/usr/lib/python2.7/dist-packages/ansible'], forks=10, become=None, become_method=None, become_user=None, check=False, diff=False)

        variable_manager = VariableManager(loader=loader, inventory=inventory)
        variable_manager.extra_vars={"ansible_ssh_user":"root" }#, "ansible_ssh_pass":"xxx"} # ??????
        # ??pb, ??????, ?????ad-hoc?playbook????????pb, ??????play?????
        # :param name: ???,??playbook?tasks??name
        # :param hosts: playbook??hosts
        # :param tasks: playbook??tasks, ?????playbook???, ??tasks??????,????????task
        play_source = {"name":"Ansible Web","hosts":"localhost","gather_facts":"no","tasks":[task]}
        print(play_source)
        play = Play().load(play_source, variable_manager=variable_manager, loader=loader)
        tqm = None
        callback = ResultsCollector()
        try:
            tqm = TaskQueueManager(
            inventory=inventory,
            variable_manager=variable_manager,
            loader=loader,
            options=options,
            passwords=None,
            stdout_callback=callback,
            run_tree=False,
            )
            result = tqm.run(play)

            if len(callback.host_ok):
                retorno=callback.host_ok[0]['result']._result
                retorno['result']='ok'
                
            if len(callback.host_failed):
                retorno=callback.host_failed[0]['result']._result
                retorno['result']='failed'
                
            if len(callback.host_unreachable):
                retorno=callback.host_unreachable[0]['result']._result
                retorno['result']='unreachable'
                

            return retorno    
        finally:
            if tqm is not None:
                tqm.cleanup()



          
