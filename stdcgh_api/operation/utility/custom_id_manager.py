from stdcgh_api.operation import models as op_models
from stdcgh_api.configuration import models as conf_models

import datetime

class IDManager():
    
    def generate_bill_no(self, data):
        print(data)
        latest_record = op_models.ReservationBillDetails.objects.filter(property=data['property']).last()
        property = conf_models.Property.objects.get(pk=data['property'])
        # date_object = datetime.datetime.strptime(data['checkin_date'], '%Y-%m-%d')
        date_object = datetime.datetime.today()

        bill_year = int(date_object.strftime('%y'))
        bill_month =int(date_object.strftime('%m'))
        sl_no = 1
        if latest_record and property:

            bill_no = latest_record.bill_no

            if bill_no:

                year =int( bill_no[-7:-5])
                month= int(bill_no[-5:-3])
                sl_no = int(bill_no[-3:])
                print(bill_year,bill_month,sl_no, year, month)
                if bill_year == year and bill_month == month  :
                    print('I am in..')
                    sl_no = sl_no+1
                    return  'B-' + property.short_name + str(bill_year) + f"{bill_month:02d}" + f"{sl_no:03d}"
                else:
                    sl_no = 1

                    return  'B-' + property.short_name + str(bill_year) + f"{bill_month:02d}" + f"{sl_no:03d}"

            return  'B-' + property.short_name + str(bill_year) + f"{bill_month:02d}" + f"{sl_no:03d}"
        return  'B-' + property.short_name + str(bill_year) + f"{bill_month:02d}" + f"{sl_no:03d}"
