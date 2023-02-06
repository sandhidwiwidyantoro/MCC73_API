using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModel
{
    public class ChartVM
    {
        public string[] Labels{ get; set; }
        public int[] Series{ get; set; }

        public ChartVM(string[] labels, int[] series)
        {
            Labels = labels;
            Series = series;
        }
    }
}
