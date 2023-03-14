from django.db.models.query import QuerySet
from stdcgh_api.configuration import models as conf_models
import datetime
from decimal import Decimal

class Calculator():
    def calculate_total_room_cost(self, rooms, days=1):
        print('days:',days)
        if days == 0:
            days=1
        total_cost=0
        if isinstance(rooms, QuerySet):

                for element in rooms:
                    print(element)
                    total_cost+=element.room_rate * days
                        
                print('Total Room Cost:', total_cost)

        if isinstance(rooms, list):
                print
                for element in rooms:
                    print(element)
                    roomRate = int(element['room_rate'])
                    init_cost = roomRate * days
                    total_cost += init_cost
                        
                print('Total Room Cost:', total_cost)
                
        if(isinstance(rooms, dict) ):
                for element in rooms:
                    print(element)
                    total_cost+=element['room_rate'] * days
                print('Total Room Cost:', total_cost)
        
        return total_cost
    
    def calculate_total_service_cost(self, services):

        total_cost=0
        if(isinstance(services, QuerySet) or isinstance(services, list)):
            for element in services:
                    print(element)
                    total_cost+=element.cost
            print('Total service Cost:', total_cost)
        if(isinstance(services, dict)):
            for element in services:
                    print(element)
                    total_cost+=element['cost']       
            print('Total service Cost:', total_cost)
        return total_cost

    def get_applicable_tax_details(self,cost):

                applicable_tax_details=conf_models.ApplicableTaxDetails.objects.filter(is_applicable=True,start_date__lte=datetime.datetime.today(),
                end_date__gte=datetime.datetime.today()).filter(lower_limit__lte=cost,upper_limit__gte=cost).last()
                
                result={'cgst_rate':0,'sgst_rate':0,'other_cess_rate':0}

                if applicable_tax_details:
                    result['cgst_rate']=applicable_tax_details.cgst_percentage
                    result['sgst_rate']=applicable_tax_details.sgst_percentage
                    result['other_cess_rate']=applicable_tax_details.service_tax_percentage

                return result

    def get_number_of_days(start_date, end_date):
            date_difference = datetime.datetime.strptime(end_date, '%Y-%m-%d') - datetime.datetime.strptime(start_date, '%Y-%m-%d')
            print('Number of Days:',date_difference.days)
            if date_difference.days == 0 :
                return date_difference.days + 1
            
            return date_difference.days
